import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EMPTY, combineLatest } from "rxjs";
import { map, exhaustMap } from "rxjs/operators";
import { ProjectsService } from "../../../api/projects/projects.service";

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"],
})
export class ProjectDetailComponent implements OnInit {
  projectKeys$ = this.projectsService.projectKeys$;
  activeProject$ = this.projectsService.activeProject$;

  orgParam$ = this.activatedRoute.paramMap.pipe(
    map((params) => params.get("org-slug"))
  );
  projectParam$ = this.activatedRoute.paramMap.pipe(
    map((params) => params.get("slug"))
  );
  orgAndProjectParams$ = combineLatest([this.orgParam$, this.projectParam$]);

  error: string;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    platform: new FormControl("", [Validators.required]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {
    this.activeProject$.subscribe((data) => {
      if (data) {
        this.form.patchValue({
          name: data.name,
          platform: data.platform,
        });
      }
    });
  }

  ngOnInit() {
    this.orgAndProjectParams$
      .pipe(
        exhaustMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            this.projectsService.retrieveProjectDetail(orgSlug, projectSlug);
            this.projectsService.retrieveClientKeys(orgSlug, projectSlug);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  onDelete(orgSlug: string, projectSlug: string) {
    if (window.confirm("Are you sure you want to delete this project?")) {
      this.projectsService.deleteProject(orgSlug, projectSlug).subscribe(
        () => this.router.navigate(["settings", orgSlug, "projects"]),
        (err) => console.log("delete project error: ", err)
      );
    }
  }

  onSubmit(orgSlug: string, projectSlug: string) {
    console.log(this.form);
    if (this.form.valid) {
      this.projectsService
        .updateProject(orgSlug, projectSlug, {
          name: this.form.value.name,
          platform: this.form.value.platform,
        })
        .subscribe(
          () => this.router.navigate(["/settings/projects"]),
          (err) => console.log("form error:", err)
        );
    } else {
      this.error = "form not valid";
    }
  }
}
