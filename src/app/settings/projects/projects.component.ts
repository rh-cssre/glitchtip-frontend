import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ProjectsService } from "../../api/projects/projects.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  projects$ = this.projectsService.getProjects;
  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }

  onDelete(projectId: number) {
    this.projectsService.deleteProject(projectId).toPromise();
  }
}
