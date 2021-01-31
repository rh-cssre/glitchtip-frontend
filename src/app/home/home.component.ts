import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { ProjectsService } from "../projects/projects.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  projects$ = this.projectsService.projects$;

  /**
   * Filters all projects by active organization
   * TODO:
   * - Suffers from lack pagination
   * - Alternatively make the home page not organization specific
   */
  activeOrganizationProjects$ = combineLatest([
    this.activeOrganizationDetail$,
    this.projects$,
  ]).pipe(
    map(([activeOrgDetail, projects]) => {
      if (!activeOrgDetail || !projects) {
        return [];
      }
      return projects.filter(
        (project) => project.organization.slug === activeOrgDetail.slug
      );
    })
  );

  constructor(
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}
