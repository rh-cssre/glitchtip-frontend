import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { OrganizationsService } from "src/app/api/organizations.service";
import { ProjectSettingsService } from "../../projects/project-settings.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

@Component({
  selector: "gt-team-projects",
  templateUrl: "./team-projects.component.html",
  styleUrls: ["./team-projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatDividerModule,
    RouterLink,
    LoadingButtonComponent,
    EmptyStateComponent,
  ],
})
export class TeamProjectsComponent implements OnInit {
  private projectsService = inject(ProjectSettingsService);
  private organizationsService = inject(OrganizationsService);
  teamSlug = input.required<string>({ alias: "team-slug" });
  orgSlug = input.required<string>({ alias: "org-slug" });

  projectsOnTeam = this.projectsService.projectsOnTeam;
  projectsNotOnTeam = this.projectsService.projectsNotOnTeam;
  loading = this.projectsService.addRemoveLoading;
  errors = this.projectsService.errors;
  project = new FormControl();
  // Adding and removing go through project endpoints that require org:write.
  canWriteOrg = this.organizationsService.canWriteOrg;
  noProjectsMessage = computed(() =>
    this.canWriteOrg()
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

  addProject() {
    const projectSlug = this.project.value;
    this.projectsService.addProjectToTeam(
      this.orgSlug(),
      this.teamSlug(),
      projectSlug,
    );
  }

  removeProject(projectSlug: string) {
    this.projectsService.removeProjectFromTeam(
      this.orgSlug(),
      this.teamSlug(),
      projectSlug,
    );
  }
}
