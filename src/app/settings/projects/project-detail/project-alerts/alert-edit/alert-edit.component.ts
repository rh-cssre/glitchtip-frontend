import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { components } from "src/app/api/api-schema";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { AlertFormComponent } from "../alert-form/alert-form.component";
import {
  AlertConditions,
  alertName,
  recipientLabel,
  resolveRecipientIcon,
} from "../alert-labels";
import { AlertSummaryComponent } from "../alert-summary/alert-summary.component";
import { NewRecipientComponent } from "../new-recipient/new-recipient.component";
import {
  NewAlertRecipient,
  ProjectAlertsService,
} from "../project-alerts.service";

type ProjectAlert = components["schemas"]["ProjectAlertSchema"];
type AlertRecipient = components["schemas"]["AlertRecipientSchema"];
type Recipient = AlertRecipient | NewAlertRecipient;

/**
 * Creates or edits one alert. Everything (name, conditions, environments,
 * recipients) is a local draft until Save sends it in one request.
 */
@Component({
  selector: "gt-alert-edit",
  templateUrl: "./alert-edit.component.html",
  styleUrl: "./alert-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    AlertFormComponent,
    AlertSummaryComponent,
    BackLinkComponent,
    FormErrorComponent,
    ListComponent,
    ListRowComponent,
    LoadingButtonComponent,
    SettingsSectionComponent,
  ],
})
export class AlertEditComponent implements OnInit {
  readonly #service = inject(ProjectAlertsService);
  readonly #dialog = inject(MatDialog);

  /** The alert to edit, or null to create one. */
  readonly alert = input<(ProjectAlert & { errorAlert?: boolean }) | null>(
    null,
  );
  readonly availableEnvironments = input<string[] | undefined>([]);
  /** Deleting an alert needs project:admin, a step above editing it. */
  readonly canDelete = input(false);
  readonly done = output<void>();

  readonly conditions = viewChild.required(AlertFormComponent);
  readonly name = new FormControl("", { nonNullable: true });
  readonly recipients = signal<Recipient[]>([]);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly deleteError = signal<string | null>(null);
  /** Seeded from the alert on init, then kept in step by the form. */
  readonly draftConditions = signal<AlertConditions>({});
  readonly teams = this.#service.projectTeams;

  readonly title = computed(() =>
    this.alert() ? $localize`Edit alert` : $localize`New alert`,
  );
  readonly displayName = computed(() => {
    const alert = this.alert();
    return alert ? alertName(alert) : "";
  });
  readonly hasEmail = computed(() =>
    this.recipients().some((r) => r.recipientType === "email"),
  );
  readonly icon = resolveRecipientIcon;

  recipientLabel(recipient: Recipient) {
    return recipientLabel(recipient, this.teams());
  }

  actionsLabel(recipient: Recipient) {
    return $localize`Actions for ${this.recipientLabel(recipient)}:recipient:`;
  }

  ngOnInit() {
    const alert = this.alert();
    this.name.setValue(alert?.name ?? "");
    // Same defaults as the form: a new alert starts on events, 1 in 1 minute.
    const events = alert ? alert.errorAlert !== false : true;
    this.draftConditions.set({
      quantity: events ? (alert?.quantity ?? 1) : null,
      timespanMinutes: events ? (alert?.timespanMinutes ?? 1) : null,
      uptime: alert?.uptime ?? false,
      environments: alert?.environments ?? [],
    });
    this.recipients.set(
      alert
        ? [...alert.alertRecipients]
        : [{ recipientType: "email", url: "" }],
    );
  }

  addRecipient() {
    this.#dialog
      .open(NewRecipientComponent, { data: { emailSelected: this.hasEmail() } })
      .afterClosed()
      .subscribe((result?: NewAlertRecipient) => {
        if (result) this.recipients.update((list) => [...list, result]);
      });
  }

  editRecipient(index: number) {
    this.#dialog
      .open(NewRecipientComponent, {
        data: {
          emailSelected: this.hasEmail(),
          editRecipient: this.recipients()[index],
        },
      })
      .afterClosed()
      .subscribe((result?: NewAlertRecipient) => {
        if (result) {
          this.recipients.update((list) =>
            list.map((recipient, i) => (i === index ? result : recipient)),
          );
        }
      });
  }

  removeRecipient(index: number) {
    this.recipients.update((list) => list.filter((_, i) => i !== index));
  }

  /** Only recipients already saved on a saved alert can be tested. */
  canTest(recipient: Recipient) {
    return !!this.alert()?.id && "id" in recipient && !!recipient.id;
  }

  testRecipient(recipient: Recipient) {
    const alertId = this.alert()?.id;
    if (alertId && "id" in recipient && recipient.id) {
      this.#service.testRecipient(alertId, recipient.id);
    }
  }

  save() {
    this.conditions().projectAlertForm.markAllAsTouched();
    // Emits through (alertSubmit) only when the conditions are valid.
    this.conditions().onSubmit();
  }

  async onConditions(conditions: {
    timespanMinutes: number;
    quantity: number;
    uptime: boolean;
    environments: string[];
  }) {
    this.saving.set(true);
    this.error.set(null);
    const error = await this.#service.saveAlert(this.alert()?.id ?? null, {
      ...conditions,
      name: this.name.value.trim(),
      alertRecipients: this.recipients(),
    });
    this.saving.set(false);
    if (error) {
      this.error.set(error);
    } else {
      this.done.emit();
    }
  }

  remove() {
    const alert = this.alert();
    if (!alert?.id) return;
    this.#dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Delete ${this.displayName()}:name:?`,
          message: $localize`Its recipients will stop getting these notifications. This cannot be undone.`,
          confirmText: $localize`Delete`,
        },
      })
      .afterClosed()
      .subscribe(async (confirmed) => {
        if (!confirmed) return;
        this.deleting.set(true);
        this.deleteError.set(null);
        const error = await this.#service.deleteProjectAlert(alert.id!);
        this.deleting.set(false);
        if (error) {
          this.deleteError.set(error);
        } else {
          this.done.emit();
        }
      });
  }
}
