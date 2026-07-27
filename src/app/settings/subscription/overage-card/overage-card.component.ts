import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  viewChild,
  TemplateRef,
} from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  MatSlideToggle,
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { OrganizationsService } from "src/app/api/organizations.service";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";

// Cap bounds, hardcoded for now (ideally exposed by the API). Max mirrors the
// backend max; min $1 is ours (the backend only requires > 0).
const MIN_CAP_CENTS = 100;
const MAX_CAP_CENTS = 100_000_000;
const DEFAULT_CAP_DOLLARS = 50;

/**
 * Overage billing card for the subscription page. Parent gates rendering on
 * eligible + configured.
 */
@Component({
  selector: "gt-overage-card",
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./overage-card.component.html",
  styleUrls: ["./overage-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverageCardComponent {
  private service = inject(SubscriptionService);
  private orgService = inject(OrganizationsService);
  private dialog = inject(MatDialog);

  private readonly migrationDialog =
    viewChild<TemplateRef<unknown>>("migrationDialog");
  private readonly toggle = viewChild(MatSlideToggle);

  readonly status = this.service.overageStatus;
  readonly enabled = this.service.overageEnabled;
  readonly capProgressPercent = this.service.capProgressPercent;
  readonly capReached = this.service.capReached;
  readonly willReachCap = this.service.willReachCap;
  readonly loading = this.service.overageConfigLoading;
  readonly error = this.service.overageConfigError;
  // org:admin is granted only to the Owner role, matching the backend's
  // owner-only POST. Non-owners get a read-only view.
  readonly canManage = this.orgService.accessOrgAdmin;

  // Estimate from event counts, not the actual Stripe charge.
  readonly costDollars = computed(
    () => (this.status()?.overageCostCents ?? 0) / 100,
  );
  readonly capDollarsCurrent = computed(
    () => (this.status()?.capCents ?? 0) / 100,
  );
  // Cap resets with the billing cycle.
  readonly resetDate = computed(() => {
    const sub = this.service.subscription();
    return sub?.subscriptionCycleEnd ?? sub?.currentPeriodEnd ?? null;
  });

  // Inline cap editing (revealed by "Adjust cap").
  readonly editingCap = signal(false);

  // Cap input. User edits override the default derived from the saved cap.
  private readonly defaultCapDollars = computed(() => {
    const cents = this.status()?.capCents ?? 0;
    return cents > 0 ? cents / 100 : DEFAULT_CAP_DOLLARS;
  });
  readonly capDollars = signal<number | null>(null);
  readonly capInputDollars = computed(
    () => this.capDollars() ?? this.defaultCapDollars(),
  );
  private readonly capCents = computed(() =>
    Math.round(this.capInputDollars() * 100),
  );
  readonly capValid = computed(
    () =>
      this.capCents() >= MIN_CAP_CENTS && this.capCents() <= MAX_CAP_CENTS,
  );
  readonly minCapDollars = MIN_CAP_CENTS / 100;
  readonly maxCapDollars = MAX_CAP_CENTS / 100;

  onCapInput(value: string) {
    const parsed = Number.parseFloat(value);
    this.capDollars.set(Number.isFinite(parsed) ? parsed : null);
  }

  async onToggle(change: MatSlideToggleChange) {
    if (change.checked && !this.enabled()) {
      // Guard the cap the same way saveCap() does; the toggle must not send an
      // out-of-bounds cap left over from an unsaved edit.
      if (!this.capValid()) {
        this.resyncToggle();
        return;
      }
      const ok = await this.confirmMigration();
      if (!ok) {
        this.resyncToggle();
        return;
      }
      const result = await this.service.configureOverage(true, this.capCents());
      if (!result) this.resyncToggle();
    } else if (!change.checked && this.enabled()) {
      const result = await this.service.configureOverage(false, 0);
      // Drop any unsaved cap edit so a later re-enable starts from the saved cap.
      this.editingCap.set(false);
      this.capDollars.set(null);
      if (!result) this.resyncToggle();
    }
  }

  startEditCap() {
    this.editingCap.set(true);
  }

  cancelEditCap() {
    this.editingCap.set(false);
    this.capDollars.set(null);
  }

  async saveCap() {
    if (!this.capValid()) return;
    const result = await this.service.configureOverage(true, this.capCents());
    if (result) this.editingCap.set(false);
  }

  // A cancelled/failed toggle leaves the switch out of sync with the resource
  // (which is the source of truth); snap it back to the real state.
  private resyncToggle() {
    const t = this.toggle();
    if (t) t.checked = this.enabled();
  }

  private confirmMigration(): Promise<boolean> {
    const tpl = this.migrationDialog();
    if (!tpl) return Promise.resolve(false);
    return firstValueFrom(this.dialog.open(tpl).afterClosed()).then(
      (result) => result === true,
    );
  }
}
