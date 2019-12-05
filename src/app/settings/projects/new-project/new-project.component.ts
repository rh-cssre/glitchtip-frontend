import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectsService } from "../../../api/projects/projects.service";

@Component({
  selector: "app-new-project",
  templateUrl: "./new-project.component.html",
  styleUrls: ["./new-project.component.scss"]
})
export class NewProjectComponent implements OnInit {
  loading = false;
  error: string;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    platform: new FormControl("")
  });
  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.projectsService
        .createProject({
          name: this.form.value.name,
          platform: this.form.value.platform
        })
        .subscribe(
          project =>
            this.router.navigate(["settings", "projects", project.slug]),
          err => {
            this.loading = false;
            this.error = "Error";
          }
        );
    }
  }
}
