import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { OrganizationsService } from "src/app/api/organizations.service";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { ProjectEnvironmentsService } from "../project-environments/project-environments.service";
import { AlertEditComponent } from "./alert-edit/alert-edit.component";
import { ProjectAlertsService } from "./project-alerts.service";
import { AlertListComponent } from "./alert-list/alert-list.component";

/** The Alerts tab: a list of alerts, or one alert's edit view (?alert=id|new). */
@Component({
  selector: "gt-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  imports: [
    MatProgressSpinnerModule,
    FormErrorComponent,
    AlertEditComponent,
    AlertListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectAlertsService, ProjectEnvironmentsService],
})
export class ProjectAlertsComponent implements OnInit {
  #service = inject(ProjectAlertsService);
  #environmentsService = inject(ProjectEnvironmentsService);
  #router = inject(Router);
  #queryParams = toSignal(inject(ActivatedRoute).queryParamMap);
  orgSlug = input.required<string>();
  projectSlug = input.required<string>();

  projectAlerts = this.#service.projectAlerts;
  initialLoad = this.#service.initialLoad;
  initialLoadError = this.#service.initialLoadError;
  #orgs = inject(OrganizationsService);
  canWriteProject = this.#orgs.canWriteProject;
  canAdminProject = this.#orgs.canAdminProject;
  availableEnvironments = this.#environmentsService.visibleEnvironments;
  projectTeams = this.#service.projectTeams;
  emptyMessage = computed(() =>
    this.canWriteProject()
      ? $localize`Create an alert to get notified when this project has new issues.`
      : $localize`This project has no alerts yet.`,
  );

  /** The alert being edited, from the URL; only for people who can edit. */
  editing = computed(() => {
    const param = this.#queryParams()?.get("alert");
    if (!param || !this.canWriteProject()) return null;
    if (param === "new") return { alert: null };
    const alert = this.projectAlerts()?.find((a) => String(a.id) === param);
    return alert ? { alert } : null;
  });

  ngOnInit(): void {
    this.#service.setParams(this.orgSlug(), this.projectSlug());
    this.#environmentsService.setParams(this.orgSlug(), this.projectSlug());
  }

  closeEdit() {
    this.#router.navigate([], {
      queryParams: { alert: null },
      queryParamsHandling: "merge",
    });
  }
}
