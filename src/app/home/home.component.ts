import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { ProjectsService } from "../api/projects/projects.service";

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
   * this.organizationsService.activeOrganizationProjects$ will give similar
   * info, but I don't think it has as much information about the projects.
   * I had a choice between using it or ditching this.projectsService.projects$,
   * and I kept the latter since that's what's here.
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
