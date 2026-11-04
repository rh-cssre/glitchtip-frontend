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
import { ProjectCardComponent } from "../project-card/project-card.component";
import { EmptyProjectsComponent } from "../project-card/empty-projects/empty-projects.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "gt-project-list",
  imports: [
    RouterModule,
    MatButtonModule,
    DatePipe,
    MatIconModule,
    ProjectCardComponent,
    EmptyProjectsComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  organizationText = $localize`organization`;
  dateCreatedText = $localize`date created`;
  issuesText = $localize`Issues`;
  settingsText = $localize`Settings`;
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
