import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { DatePipe } from "@angular/common";
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
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { map } from "rxjs";
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
import { MatTabsModule } from "@angular/material/tabs";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { ProjectDetailService } from "./project-detail.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations.service";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { MatIconModule } from "@angular/material/icon";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { ProjectAlertsService } from "./project-alerts/project-alerts.service";
import { ProjectEnvironmentsService } from "./project-environments/project-environments.service";

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
  imports: [
    DatePipe,
    MatInputModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingButtonComponent,
    CopyInputComponent,
    ProjectEnvironments,
    ProjectAlertsComponent,
    MatButtonModule,
    RouterLink,
    PageHeaderComponent,
    BackLinkComponent,
    TopAppBar,
    SettingsSectionComponent,
    FormErrorComponent,
  ],
  // The tab services live here, so the tab counts and the tabs share one load.
  providers: [
    ProjectDetailService,
    ProjectAlertsService,
    ProjectEnvironmentsService,
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher },
  ],
})
export class ProjectDetailComponent implements OnInit {
  #service = inject(ProjectDetailService);
  #orgService = inject(OrganizationsService);
  #snackBar = inject(MatSnackBar);
  #router = inject(Router);
  private dialog = inject(MatDialog);

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;

  projectKeys = this.#service.projectKeys;
  #alertsService = inject(ProjectAlertsService);
  #environmentsService = inject(ProjectEnvironmentsService);
  /** Tab counts, shown once known (including 0). DSN holds one thing: none. */
  readonly tabCounts = computed<Record<string, number | null>>(() => ({
    environments: this.#environmentsService.initialLoad()
      ? (this.#environmentsService.environments()?.length ?? 0)
      : null,
    alerts:
      this.#alertsService.initialLoad() &&
      !this.#alertsService.initialLoadError()
        ? (this.#alertsService.projectAlerts()?.length ?? 0)
        : null,
  }));
  activeProject = this.#service.project;

  orgSlug = input.required<string>({ alias: "org-slug" });
  projectSlug = input.required<string>({ alias: "project-slug" });

  deleteLoading = this.#service.deleteLoading;
  deleteError = this.#service.deleteError;
  updateNameLoading = this.#service.updateNameLoading;
  updateNameError = this.#service.updateNameError;
  updatePlatformLoading = this.#service.updatePlatformLoading;
  updatePlatformError = this.#service.updatePlatformError;
  canWriteProject = this.#orgService.canWriteProject;
  canAdminProject = this.#orgService.canAdminProject;

  readonly tabs = [
    { id: "general", label: $localize`General` },
    { id: "dsn", label: $localize`DSN` },
    { id: "environments", label: $localize`Environments` },
    { id: "alerts", label: $localize`Alerts` },
  ];
  readonly tab = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => {
        const tab = params.get("tab");
        return this.tabs.some((t) => t.id === tab) ? tab : "general";
      }),
    ),
    { initialValue: "general" },
  );
  readonly dsnTitle = $localize`DSN`;
  readonly noPlatformLabel = $localize`No platform set`;
  readonly securityEndpointLabel = $localize`Security endpoint`;

  keySuffix(
    key: { label?: string | null; name?: string | null },
    index: number,
    count: number,
  ) {
    if (count < 2) return "";
    return ": " + (key.label || key.name || $localize`Key ${index + 1}`);
  }

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
      this.#alertsService.setParams(this.orgSlug(), this.projectSlug());
      this.#environmentsService.setParams(this.orgSlug(), this.projectSlug());
    });
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

  deleteProject() {
    const name = this.activeProject()?.name;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete ${name}:name:?`,
        message: $localize`All of its issues, events and settings will be deleted. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        const result = await this.#service.deleteProject();
        if (result) {
          this.#orgService.refreshActiveOrganization();
          this.#snackBar.open(
            $localize`Your project has been successfully deleted`,
          );
          this.#router.navigate([this.orgSlug(), "settings", "projects"]);
        }
      }
    });
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
      } else if (this.updateNameError()) {
        mapFormErrors({ name: [this.updateNameError()] }, this.nameForm);
      }
    }
  }

  async updatePlatform(projectName: string) {
    if (this.platformCtrl.invalid) {
      this.platformCtrl.markAsTouched();
      return;
    }
    const resp = await this.#service.updateProjectPlatform(
      this.platformForm.value.platform ?? "",
      projectName,
    );
    if (resp) {
      const platform = this.getPlatformName(resp.platform!);
      this.#snackBar.open(
        $localize`Your project platform has been updated to ${platform}:platform:.`,
      );
    } else if (this.updatePlatformError()) {
      mapFormErrors(
        { platform: [this.updatePlatformError()] },
        this.platformForm,
      );
    }
  }
}
