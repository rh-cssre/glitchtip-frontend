import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { OrganizationsService } from "src/app/api/organizations.service";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ProjectEnvironmentsService } from "../project-environments/project-environments.service";
import { AlertEditComponent } from "./alert-edit/alert-edit.component";
import {
  alertName,
  alertSummary,
  recipientLabel,
  resolveRecipientIcon,
} from "./alert-labels";
import { ProjectAlertsService } from "./project-alerts.service";

export { iconXrefMapping, resolveRecipientIcon } from "./alert-labels";

/** The Alerts tab: a list of alerts, or one alert's edit view (?alert=id|new). */
@Component({
  selector: "gt-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    EmptyStateComponent,
    ListComponent,
    ListRowComponent,
    AlertEditComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectAlertsService, ProjectEnvironmentsService],
})
export class ProjectAlertsComponent implements OnInit {
  deleteAlertForLabel = (url: string | null | undefined) => $localize`Delete Alert For ${url ?? ""}:url:`;
  deleteAlertLabel = (n: number) => $localize`Delete Alert ${n}:number:`;
  removeAlertText = (n: number) => $localize`Remove Alert ${n}:number:`;
  #service = inject(ProjectAlertsService);
  #environmentsService = inject(ProjectEnvironmentsService);
  #router = inject(Router);
  #queryParams = toSignal(inject(ActivatedRoute).queryParamMap);
  orgSlug = input.required<string>();
  projectSlug = input.required<string>();

  projectAlerts = this.#service.projectAlerts;
  initialLoad = this.#service.initialLoad;
  initialLoadError = this.#service.initialLoadError;
  accessProjectWrite = inject(OrganizationsService).accessProjectWrite;
  availableEnvironments = this.#environmentsService.visibleEnvironments;
  alertName = alertName;
  alertSummary = alertSummary;
  projectTeams = this.#service.projectTeams;
  recipientLabel = recipientLabel;
  resolveRecipientIcon = resolveRecipientIcon;

  /** The alert being edited, from the URL; only for people who can edit. */
  editing = computed(() => {
    const param = this.#queryParams()?.get("alert");
    if (!param || !this.accessProjectWrite()) return null;
    if (param === "new") return { alert: null };
    const alert = this.projectAlerts()?.find((a) => String(a.id) === param);
    return alert ? { alert } : null;
  });

  ngOnInit(): void {
    this.#service.setParams(this.orgSlug(), this.projectSlug());
    this.#environmentsService.setParams(this.orgSlug(), this.projectSlug());
  }

  openEdit(alert: number | "new") {
    this.#router.navigate([], {
      queryParams: { alert },
      queryParamsHandling: "merge",
    });
  }

  closeEdit() {
    this.#router.navigate([], {
      queryParams: { alert: null },
      queryParamsHandling: "merge",
    });
  }
}
