import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { filter, first, map, tap } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { flattenedPlatforms } from "src/app/settings/projects/platform-picker/platforms-for-picker";
import { ProjectDetail } from "src/app/api/projects/projects-api.interfaces";
import { ProjectSettingsService } from "../project-settings.service";
import { MatButtonModule } from "@angular/material/button";
import { ProjectAlertsComponent } from "./project-alerts/project-alerts.component";
import { ProjectEnvironmentsComponent } from "./project-environments/project-environments.component";
import { CopyInputComponent } from "../../../shared/copy-input/copy-input.component";
import { PlatformPickerComponent } from "../platform-picker/platform-picker.component";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

@Component({
  selector: "gt-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    LoadingButtonComponent,
    PlatformPickerComponent,
    CopyInputComponent,
    ProjectEnvironmentsComponent,
    ProjectAlertsComponent,
    MatButtonModule,
    RouterLink,
    DetailHeaderComponent,
  ],
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

  nameForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64)]),
  });

  platformForm = new FormGroup({
    platform: new FormControl(""),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectSettingsService,
    private snackBar: MatSnackBar,
    private orgService: OrganizationsService
  ) {}

  ngOnDestroy() {
    this.projectsService.clearActiveProject();
  }

  get name() {
    return this.nameForm.get("name");
  }

  get platform() {
    return this.platformForm.get("platform");
  }

  getPlatformName = (id: string) =>
    flattenedPlatforms.find((platform) => platform.id === id)?.name || id;

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
          this.projectsService.retrieveCurrentProjectClientKeys(orgSlug);
        }
      });
    this.activeProject$
      .pipe(
        filter((data) => !!data),
        first(),
        tap((data) => {
          this.nameForm.patchValue({
            name: data!.name,
          });
          this.platformForm.patchValue({
            platform: data!.platform,
          });
        })
      )
      .subscribe();
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
            this.orgService.refreshOrganizationDetail().subscribe();
            this.snackBar.open("Your project has been sucessfully deleted");
            this.router.navigate([this.orgSlug, "settings", "projects"]);
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
    if (this.nameForm.valid && this.orgSlug && this.projectSlug) {
      this.projectsService
        .updateProjectName(
          this.orgSlug,
          this.projectSlug,
          this.nameForm.value.name!
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
          this.platformForm.value.platform ?? "",
          projectName
        )
        .subscribe(
          (resp: ProjectDetail) => {
            this.updatePlatformLoading = false;
            if (this.updatePlatformError) {
              this.updatePlatformError = "";
            }
            this.snackBar.open(
              `Your project platform has been updated to ${this.getPlatformName(
                resp.platform
              )}.`
            );
            this.platformForm.setValue({ platform: resp.platform });
          },
          (err) => {
            this.updatePlatformError = `${err.statusText}: ${err.status}`;
          }
        );
    }
  }
}
