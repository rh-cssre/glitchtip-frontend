import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  computed,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { ProjectsService } from "src/app/projects/projects.service";
import { ProjectRowsComponent } from "./project-rows.component";
import { PanelComponent } from "../panel/panel.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { TopAppBar } from "../top-app-bar/top-app-bar";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-project-list",
  imports: [
    RouterModule,
    MatButtonModule,
    ProjectRowsComponent,
    PanelComponent,
    EmptyStateComponent,
    TopAppBar,
  ],
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  noProjectsCanCreate = $localize`Create a project to start sending events.`;
  noProjectsAskOwner = $localize`Ask an organization owner, manager or admin to create one.`;
  private organizationsService = inject(OrganizationsService);
  private projectsService = inject(ProjectsService);

  @Input() activeOrgOnly = false;

  activeOrganization = this.organizationsService.activeOrganization;
  projects = computed(() => this.projectsService.projects() || []);
  organizations = this.organizationsService.organizations;
  orgServiceInitialLoad = this.organizationsService.initialLoad;
  orgsAndProjects = computed(() =>
    this.organizations().map((organization) => ({
      ...organization,
      newProjectLabel: $localize`Create new project in ${organization.name}:organization:`,
      projects: this.projects().filter(
        (project) => project.organization.id.toString() === organization.id,
      ),
    })),
  );
  // Scopes come from one selected org, so only the single-org view is gated.
  canWriteProject = this.organizationsService.canWriteProject;

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}
