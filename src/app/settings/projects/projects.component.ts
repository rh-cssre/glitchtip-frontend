import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ProjectsService } from "../../api/projects/projects.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  projects$ = this.projectsService.getProjects;
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;

  constructor(
    private projectsService: ProjectsService,
    private organizationsService: OrganizationsService
  ) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }

  onDelete(projectId: number) {
    if (window.confirm("Are you sure you want to delete your project?")) {
      this.projectsService.deleteProject(projectId).toPromise();
    }
  }
}
