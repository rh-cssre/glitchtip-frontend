import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from "@angular/core";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectsService } from "src/app/projects/projects.service";

@Component({
  selector: "gt-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  @Input() activeOrgOnly = false;

  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  projects$ = this.projectsService.projects$;
  organizations$ = this.organizationsService.organizations$;
  orgsAndProjects$ = combineLatest([this.organizations$, this.projects$]).pipe(
    map(([organizations, projects]) =>
      organizations.map((organization) => ({
        ...organization,
        projects: projects
          ? projects.filter(
              (project) => project.organization.id === organization.id
            )
          : [],
      }))
    )
  );

  constructor(
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}
