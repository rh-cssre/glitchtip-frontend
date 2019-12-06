import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectsService } from "../../../api/projects/projects.service";

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"]
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  organizationSlug: string;
  projectSlug: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => of(params.get("slug"))))
      .subscribe(slug => (this.projectSlug = slug));

    this.projectsService
      .retrieveProjectDetail("test-org", this.projectSlug)
      .subscribe(project => {
        this.project = project;
      });
    console.log(this.project);
  }
}
