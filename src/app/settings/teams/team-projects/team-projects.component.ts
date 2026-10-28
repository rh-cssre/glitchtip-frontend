import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProjectSettingsService } from "../../projects/project-settings.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";

@Component({
  selector: "gt-team-projects",
  templateUrl: "./team-projects.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    RouterLink,
    LoadingButtonComponent,
    ListComponent,
    ListRowComponent,
    ListRowLinkComponent,
    EmptyStateComponent,
    PanelComponent,
    FormErrorComponent,
    SettingsSectionComponent,
  ],
})
export class TeamProjectsComponent implements OnInit {
  private projectsService = inject(ProjectSettingsService);
  private dialog = inject(MatDialog);
  teamSlug = input.required<string>({ alias: "team-slug" });
  orgSlug = input.required<string>({ alias: "org-slug" });

  // Only managers and owners can change a team's projects.
  canEditProjects = inject(OrganizationsService).canWriteOrg;
  projectsOnTeam = this.projectsService.projectsOnTeam;
  projectsNotOnTeam = this.projectsService.projectsNotOnTeam;
  loading = this.projectsService.addRemoveLoading;
  errors = this.projectsService.errors;
  project = new FormControl<string | null>(null, Validators.required);
  // Adding and removing go through project endpoints that require org:write.
  noProjectsMessage = computed(() =>
    this.canEditProjects()
      ? $localize`Add a project so this team's members get its alerts.`
      : $localize`Ask an organization manager or owner to add projects to this team.`,
  );

  ngOnInit(): void {
    this.projectsService.setParams(this.orgSlug(), this.teamSlug());
    this.projectsService.retrieveProjectsOnTeam(
      this.orgSlug(),
      this.teamSlug(),
    );
    this.projectsService.retrieveProjectsNotOnTeam(
      this.orgSlug(),
      this.teamSlug(),
    );
  }

  async addProject() {
    const projectSlug = this.project.value;
    if (!projectSlug) {
      this.project.markAsTouched();
      return;
    }
    await this.projectsService.addProjectToTeam(
      this.orgSlug(),
      this.teamSlug(),
      projectSlug,
    );
    if (!this.projectsNotOnTeam().some((p) => p.slug === projectSlug)) {
      this.project.reset();
    }
  }

  removeProject(projectSlug: string, projectName: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Remove ${projectName}:project: from #${this.teamSlug()}:team:?`,
          message: $localize`This team's members will stop getting its email alerts.`,
          confirmText: $localize`Remove`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.projectsService.removeProjectFromTeam(
            this.orgSlug(),
            this.teamSlug(),
            projectSlug,
          );
        }
      });
  }
}
