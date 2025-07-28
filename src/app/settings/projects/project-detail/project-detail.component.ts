import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  effect,
  inject,
  input,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { flattenedPlatforms } from "src/app/settings/projects/platform-picker/platforms-for-picker";
import { MatButtonModule } from "@angular/material/button";
import { ProjectAlertsComponent } from "./project-alerts/project-alerts.component";
import { ProjectEnvironments } from "./project-environments/project-environments";
import { CopyInputComponent } from "../../../shared/copy-input/copy-input.component";
import { PlatformPickerComponent } from "../platform-picker/platform-picker.component";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { ProjectDetailService } from "./project-detail.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-project-detail",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"],
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    LoadingButtonComponent,
    PlatformPickerComponent,
    CopyInputComponent,
    ProjectEnvironments,
    ProjectAlertsComponent,
    MatButtonModule,
    RouterLink,
    DetailHeaderComponent,
  ],
  providers: [ProjectDetailService],
})
export class ProjectDetailComponent implements OnInit {
  #service = inject(ProjectDetailService);
  #orgService = inject(OrganizationsService);
  #snackBar = inject(MatSnackBar);
  #router = inject(Router);

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;

  projectKeys = this.#service.projectKeys;
  activeProject = this.#service.project;

  orgSlug = input.required<string>({ alias: "org-slug" });
  projectSlug = input.required<string>({ alias: "project-slug" });

  deleteLoading = this.#service.deleteLoading;
  deleteError = this.#service.deleteError;
  updateNameLoading = this.#service.updateNameLoading;
  updateNameError = this.#service.updateNameError;
  updatePlatformLoading = this.#service.updatePlatformLoading;
  updatePlatformError = this.#service.updatePlatformError;

  nameForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64)]),
  });

  platformForm = new FormGroup({
    platform: new FormControl(""),
  });

  get name() {
    return this.nameForm.get("name");
  }

  get platform() {
    return this.platformForm.get("platform");
  }

  constructor() {
    effect(() => {
      const project = this.activeProject();
      if (project) {
        this.nameForm.patchValue({
          name: project!.name,
        });
        this.platformForm.patchValue({
          platform: project!.platform,
        });
      }
    });
  }

  getPlatformName = (id: string) =>
    flattenedPlatforms.find((platform) => platform.id === id)?.name || id;

  ngOnInit() {
    this.#service.setParams(this.orgSlug(), this.projectSlug());
  }

  async deleteProject() {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const result = await this.#service.deleteProject();
      if (result) {
        this.#orgService.refreshActiveOrganization();
        this.#snackBar.open(
          $localize`Your project has been sucessfully deleted`,
        );
        this.#router.navigate([this.orgSlug(), "settings", "projects"]);
      }
    }
  }

  async updateName() {
    if (this.nameForm.valid) {
      const resp = await this.#service.updateProjectName(
        this.nameForm.value.name!,
      );
      if (resp) {
        this.#snackBar.open(
          $localize`The name of your project has been updated to ${resp.name}`,
        );
      }
    }
  }

  async updatePlatform(projectName: string) {
    const resp = await this.#service.updateProjectPlatform(
      this.platformForm.value.platform ?? "",
      projectName,
    );
    if (resp) {
      this.#snackBar.open(
        `Your project platform has been updated to ${this.getPlatformName(
          resp.platform!,
        )}.`,
      );
    }
  }
}
