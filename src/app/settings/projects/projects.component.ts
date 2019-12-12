import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "../../api/projects/projects.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnInit {
  projects: any;
  constructor(private projectsService: ProjectsService) {}

  loadProjects() {
    this.projectsService.retrieveProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  ngOnInit() {
    this.loadProjects();
  }

  onDelete(organizationSlug: string, projectSlug: string) {
    this.projectsService
      .deleteProject(organizationSlug, projectSlug)
      .subscribe(err => console.log("error:", err));
  }
}
