import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validators,
  FormGroupDirective,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
  FlatPlatform,
  flattenedPlatforms,
  otherPlatformFlat,
} from "../new-project/platform-picker/platforms-for-picker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { ErrorStateMatcher } from "@angular/material/core";
import { ProjectAlertsComponent } from "./project-alerts/project-alerts.component";
import { ProjectEnvironments } from "./project-environments/project-environments";
import { CopyInputComponent } from "../../../shared/copy-input/copy-input.component";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { ProjectDetailService } from "./project-detail.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations.service";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { MatIconModule } from "@angular/material/icon";

function autocompleteStringValidator(
  validOptions: Array<FlatPlatform>,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.some((option) => option.id === control.value)) {
      return null; /* valid option selected */
    }
    return { invalidAutocompleteString: { value: control.value } };
  };
}

function isCustomErrorState(control: FormControl): boolean {
  return control.invalid && (control.dirty || control.touched);
}

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return isCustomErrorState(control);
  }
}

@Component({
  selector: "gt-project-detail",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.scss"],
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingButtonComponent,
    CopyInputComponent,
    ProjectEnvironments,
    ProjectAlertsComponent,
    MatButtonModule,
    RouterLink,
    DetailHeaderComponent,
    BackLinkComponent,
  ],
  providers: [
    ProjectDetailService,
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher },
  ],
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

  platforms = flattenedPlatforms.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  filteredPlatforms = signal<FlatPlatform[]>([]);
  platformForm = new FormGroup({
    platform: new FormControl("", {
      validators: [autocompleteStringValidator(this.platforms)],
    }),
  });

  get name() {
    return this.nameForm.get("name");
  }

  platformCtrl = this.platformForm.get("platform") as FormControl;
  platformCtrlValueChanges = toSignal(this.platformCtrl.valueChanges);
  platformCtrlInvalid = isCustomErrorState(this.platformCtrl);

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
    effect(() => {
      const filterValue = this.platformCtrlValueChanges();
      if (filterValue === "" || !filterValue) {
        this.filteredPlatforms.set(this.platforms);
      } else {
        const filterResults = this.platforms.filter((platform) =>
          platform.id.toLowerCase().includes(filterValue.toLowerCase()),
        );
        this.filteredPlatforms.set(
          filterResults.length ? filterResults : [otherPlatformFlat],
        );
      }
    });
  }

  clearFilter() {
    this.platformCtrl.setValue("");
    this.filteredPlatforms.set(this.platforms);
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
    if (this.platformCtrl.invalid) {
      return;
    }
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
