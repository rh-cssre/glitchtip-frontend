import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectsService } from "../../../api/projects/projects.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"]
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  organizationSlug: string;
  projectSlug: string;
  error: string;

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    platform: new FormControl("", [Validators.required])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  loadValues() {
    this.form.setValue({
      name: this.project.name,
      platform: this.project.platform
    });
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => of(params.get("slug"))))
      .subscribe(slug => (this.projectSlug = slug));

    this.projectsService
      .retrieveProjectDetail("test-org", this.projectSlug)
      .subscribe(project => {
        this.project = project;
        this.loadValues();
      });
  }

  onDelete(projectId: number) {
    this.projectsService.deleteProject(projectId);
  }

  onSubmit() {
    console.log(this.form);
    if (this.form.valid) {
      this.projectsService
        .updateProject(this.project.organization.slug, this.project.slug, {
          name: this.form.value.name,
          platform: this.form.value.platform
        })
        .subscribe(
          () => this.router.navigate(["/settings/projects"]),
          err => console.log("error:", err)
        );
    } else {
      this.error = "form not valid";
    }
  }
}
