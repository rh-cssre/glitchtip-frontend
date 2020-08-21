import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { ProjectsService } from "../../../api/projects/projects.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProjectDetail } from "src/app/api/projects/projects.interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;

  projectKeys$ = this.projectsService.projectKeys$;
  activeProject$ = this.projectsService.activeProject$;

  orgSlug: string | undefined;
  projectSlug: string | undefined;

  deleteLoading = false;
  deleteError = "";
  updateNameLoading = false;
  updateNameError = "";
  updatePlatformLoading = false;
  updatePlatformError = "";

  copiedDsn = false;

  nameForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });

  platformForm = new FormGroup({
    platform: new FormControl(""),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private snackBar: MatSnackBar,
    private orgService: OrganizationsService
  ) {
    this.activeProject$.subscribe((data) => {
      if (data) {
        this.nameForm.patchValue({
          name: data.name,
        });
        this.platformForm.patchValue({
          platform: data.platform,
        });
      }
    });
  }

  ngOnDestroy() {
    this.projectsService.clearActiveProject();
  }

  get name() {
    return this.nameForm.get("name");
  }

  get platform() {
    return this.platformForm.get("platform");
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          const orgSlug: string | undefined = params["org-slug"];
          const projectSlug: string | undefined = params["project-slug"];
          this.orgSlug = orgSlug;
          this.projectSlug = projectSlug;
          return { orgSlug, projectSlug };
        })
      )
      .subscribe(({ orgSlug, projectSlug }) => {
        if (orgSlug && projectSlug) {
          this.projectsService.retrieveProjectDetail(orgSlug, projectSlug);
          this.projectsService.retrieveClientKeys(orgSlug, projectSlug);
        }
      });
  }

  deleteProject() {
    if (
      window.confirm("Are you sure you want to delete this project?") &&
      this.orgSlug &&
      this.projectSlug
    ) {
      this.deleteLoading = true;
      this.projectsService
        .deleteProject(this.orgSlug, this.projectSlug)
        .subscribe(
          () => {
            this.deleteLoading = false;
            this.orgService.refreshOrganizationDetail();
            this.snackBar.open("Your project has been sucessfully deleted");
            this.router.navigate(["settings", this.orgSlug, "projects"]);
          },
          (err) => {
            this.deleteLoading = false;
            this.deleteError = `${err.statusText}: ${err.status}`;
          }
        );
    }
  }

  updateName() {
    this.updateNameLoading = true;
    if (this.orgSlug && this.projectSlug) {
      this.projectsService
        .updateProjectName(
          this.orgSlug,
          this.projectSlug,
          this.nameForm.value.name
        )
        .subscribe(
          (resp: ProjectDetail) => {
            this.updateNameLoading = false;
            if (this.updateNameError) {
              this.updateNameError = "";
            }
            this.snackBar.open(
              `The name of your project has been updated to ${resp.name}`
            );
          },
          (err) => {
            this.updateNameError = `${err.statusText}: ${err.status}`;
          }
        );
    }
  }

  updatePlatform(projectName: string) {
    this.updatePlatformLoading = true;
    if (this.orgSlug && this.projectSlug) {
      this.projectsService
        .updateProjectPlatform(
          this.orgSlug,
          this.projectSlug,
          this.platformForm.value.platform,
          projectName
        )
        .subscribe(
          (resp: ProjectDetail) => {
            this.updatePlatformLoading = false;
            if (this.updatePlatformError) {
              this.updatePlatformError = "";
            }
            this.snackBar.open(
              `Your project platform has been updated to ${resp.platform}`
            );
          },
          (err) => {
            this.updatePlatformError = `${err.statusText}: ${err.status}`;
          }
        );
    }
  }

  copied() {
    this.copiedDsn = true;
    setTimeout(() => (this.copiedDsn = false), 4000);
  }
}
