import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "../../api/projects/projects.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnInit {
  projects: any;
  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.retrieveProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
}
