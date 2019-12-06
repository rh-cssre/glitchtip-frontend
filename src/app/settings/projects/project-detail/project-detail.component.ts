import { Component, OnInit, Input } from "@angular/core";
import { ProjectsService } from "../../../api/projects/projects.service";

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"]
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.retrieveProjectDetail("project").subscribe(project => {
      this.project = project;
    });
    console.log(this.project);
  }
}
