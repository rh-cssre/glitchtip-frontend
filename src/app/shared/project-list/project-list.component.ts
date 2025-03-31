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
import { MatCardModule } from "@angular/material/card";
import { ProjectsService } from "src/app/projects/projects.service";
import { ProjectCardComponent } from "../project-card/project-card.component";
import { EmptyProjectsComponent } from "../project-card/empty-projects/empty-projects.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { DatePipe } from "@angular/common";

@Component({
  selector: "gt-project-list",
  imports: [
    RouterModule,
    MatButtonModule,
    DatePipe,
    MatCardModule,
    ProjectCardComponent,
    EmptyProjectsComponent,
  ],
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private projectsService = inject(ProjectsService);

  @Input() activeOrgOnly = false;

  activeOrganization = this.organizationsService.activeOrganization;
  projects = toSignal(this.projectsService.projects$);
  organizations = this.organizationsService.organizations;
  orgServiceInitialLoad = this.organizationsService.initialLoad;
  orgsAndProjects = computed(() =>
    this.organizations().map((organization) => ({
      ...organization,
      projects: this.projects()?.filter(
        (project) => project.organization.id.toString() === organization.id,
      ),
    })),
  );

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}
