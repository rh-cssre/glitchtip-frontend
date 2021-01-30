import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectsService } from "src/app/projects/projects.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  projects$ = this.organizationsService.activeOrganizationProjects$;
  activeOrganizationSlug$ = this.organizationsService.activeOrganizationSlug$;
  projectsForActiveOrg$ = this.projectsService.projectsForActiveOrg$;

  constructor(
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}
