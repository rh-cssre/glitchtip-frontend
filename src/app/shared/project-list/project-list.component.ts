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
import { MatIconModule } from "@angular/material/icon";
import { ProjectsService } from "src/app/projects/projects.service";
import { ProjectRowsComponent } from "./project-rows.component";
import { PanelComponent } from "../panel/panel.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { TopAppBar } from "../top-app-bar/top-app-bar";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-project-list",
  imports: [
    RouterModule,
    MatButtonModule,
    ProjectRowsComponent,
    PanelComponent,
    EmptyStateComponent,
    MatIconModule,
    TopAppBar,
    ListTitleComponent,
  ],
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  projectsTitle = $localize`Projects`;
  homeTitle = $localize`Home`;
  noProjectsCanCreate = $localize`Add a project to start capturing errors.`;
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
  activeOrgProjectCount = computed(() => {
    const id = this.activeOrganization()?.id;
    return id === undefined
      ? undefined
      : String(
          this.orgsAndProjects().find((o) => o.id === id)?.projects.length ?? 0,
        );
  });
  // Scopes come from one selected org, so only the single-org view is gated.
  canWriteProject = this.organizationsService.canWriteProject;

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}
