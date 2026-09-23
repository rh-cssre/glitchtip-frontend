import {
  Component,
  OnInit,
  computed,
  effect,
  input,
  output,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { DecimalPipe, NgTemplateOutlet } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MonitorInput, MonitorType } from "../uptime.interfaces";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { ServerError } from "src/app/shared/django.interfaces";
import { OrganizationsService } from "src/app/api/organizations.service";
import { EnvironmentsService } from "src/app/api/environments.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { toSignal } from "@angular/core/rxjs-interop";
import { components } from "src/app/api/api-schema";

type MonitorDetail = components["schemas"]["MonitorDetailSchema"];

const defaultExpectedStatus = 200;
const defaultInterval = 60;

// returns a pattern error to simplify error checking in template
export function portUrlValidator(
  control: AbstractControl<string>,
): ValidationErrors | null {
  if (control.value.startsWith("https:")) {
    return { pattern: true };
  }
  return null;
}

const standardUrlValidators = [
  Validators.pattern(urlRegex),
  Validators.required,
  Validators.maxLength(2000),
];

const portUrlValidators = [
  Validators.required,
  Validators.maxLength(2000),
  portUrlValidator,
];

@Component({
  selector: "gt-monitor-form",
  templateUrl: "./monitor-form.component.html",
  styleUrls: ["./monitor-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DecimalPipe,
    NgTemplateOutlet,
    ReactiveFormsModule,
    RouterModule,
    LoadingButtonComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatOptionModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
  ],
})
export class MonitorFormComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private environmentsService = inject(EnvironmentsService);
  private subscriptionService = inject(SubscriptionService);
  dialog = inject(MatDialog);

  readonly monitorSettings = input<MonitorDetail>();
  readonly formError = input.required<ServerError | null>();
  readonly loading = input.required<boolean | null>();

  readonly formSubmitted = output<MonitorInput>();

  orgProjects = this.organizationsService.activeOrganizationProjects;
  orgEnvironments = this.environmentsService.orgEnvironments;
  totalEventsAllowed = this.subscriptionService.totalEventsAllowed;

  intervalPerMonth = signal<number | null>(null);

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat", "TCP Port"];

  formMonitorType = new FormControl<MonitorType>("Ping", {
    nonNullable: true,
    validators: [Validators.required],
  });

  formName = new FormControl<string>("", {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(200)],
  });

  formUrl = new FormControl<string>("https://", {
    nonNullable: true,
    validators: standardUrlValidators,
  });

  formExpectedStatus = new FormControl<number>(defaultExpectedStatus, [
    Validators.required,
    Validators.min(100),
    Validators.pattern(intRegex),
  ]);

  formExpectedBody = new FormControl("");

  formInterval = new FormControl<number>(defaultInterval, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(32767)],
  });

  formTimeout = new FormControl<number | null>(null, [
    Validators.min(1),
    Validators.max(60),
    Validators.pattern(intRegex),
  ]);

  formProject = new FormControl<string | null>(null);

  formEnvironment = new FormControl<number | null>(null);

  monitorForm = new FormGroup({
    monitorType: this.formMonitorType,
    name: this.formName,
    url: this.formUrl,
    expectedStatus: this.formExpectedStatus,
    expectedBody: this.formExpectedBody,
    interval: this.formInterval,
    timeout: this.formTimeout,
    project: this.formProject,
    environmentID: this.formEnvironment,
  });

  private selectedProjectID = toSignal(this.formProject.valueChanges, {
    initialValue: this.formProject.value,
  });

  private selectedProjectSlug = computed(() => {
    const projectID = this.selectedProjectID();
    if (!projectID) return null;
    return (
      this.orgProjects().find((project) => project.id === projectID)?.slug ??
      null
    );
  });

  private projectEnvironmentsResource = apiResource.fetchAll(
    computed(() => {
      const orgSlug = this.organizationsService.activeOrganizationSlug();
      const projectSlug = this.selectedProjectSlug();
      return orgSlug && projectSlug ? { orgSlug, projectSlug } : undefined;
    }),
    (params) => ({
      url: "/api/0/projects/{organization_slug}/{project_slug}/environments/",
      options: {
        params: {
          path: {
            organization_slug: params.orgSlug,
            project_slug: params.projectSlug,
          },
        },
      },
    }),
  );

  // The project endpoint returns EnvironmentProject (association) ids, not
  // Environment ids, so resolve each name against the org list to get the id
  // the API expects. Names are unique within an organization.
  environmentOptions = computed(() => {
    const idsByName = new Map(
      this.orgEnvironments().map((environment) => [
        environment.name,
        environment.id,
      ]),
    );
    const projectEnvironments = this.projectEnvironmentsResource.value() ?? [];
    return projectEnvironments
      .filter((environment) => !environment.isHidden)
      .map((environment) => ({
        name: environment.name,
        id: idsByName.get(environment.name) ?? null,
      }))
      .filter((environment) => environment.id !== null);
  });

  environmentDisabled = computed(() => !this.selectedProjectSlug());

  constructor() {
    // Disabled state lives on the control, not the template.
    effect(() => {
      const disabled = this.environmentDisabled();
      if (disabled && this.formEnvironment.enabled) {
        this.formEnvironment.disable({ emitEvent: false });
      } else if (!disabled && this.formEnvironment.disabled) {
        this.formEnvironment.enable({ emitEvent: false });
      }

      if (disabled) {
        if (this.formEnvironment.value !== null) {
          this.formEnvironment.setValue(null, { emitEvent: false });
        }
        return;
      }

      // An in-flight empty list would clear a valid selection.
      if (!this.projectEnvironmentsResource.hasValue()) return;

      const selected = this.formEnvironment.value;
      if (selected === null) return;
      const stillValid = this.environmentOptions().some(
        (environment) => environment.id === selected,
      );
      if (!stillValid) {
        this.formEnvironment.setValue(null, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    const initialInterval = this.monitorSettings()?.interval ?? defaultInterval;
    this.intervalPerMonth.set(Math.floor(2592000 / initialInterval));

    this.formInterval.valueChanges.subscribe((interval) => {
      this.intervalPerMonth.set(Math.floor(2592000 / interval));
    });

    const monitorSettings = this.monitorSettings();
    if (monitorSettings) {
      this.formName.patchValue(monitorSettings.name);
      this.formMonitorType.patchValue(monitorSettings.monitorType);
      this.formUrl.patchValue(monitorSettings.url ? monitorSettings.url : "");
      this.formExpectedStatus.patchValue(
        monitorSettings.expectedStatus
          ? monitorSettings.expectedStatus
          : defaultExpectedStatus,
      );
      this.formExpectedBody.patchValue(monitorSettings.expectedBody!);
      this.formInterval.patchValue(monitorSettings.interval);
      this.formTimeout.patchValue(monitorSettings.timeout!);
      this.formProject.patchValue(monitorSettings.projectID);
      this.formEnvironment.patchValue(monitorSettings.environmentID ?? null);
    }

    this.updateRequiredFields();
  }

  updateRequiredFields() {
    this.formUrl.enable();
    this.formUrl.setValidators(standardUrlValidators);
    this.formExpectedStatus.enable();
    this.formExpectedBody.enable();
    this.formTimeout.enable();
    if (this.formMonitorType.value === "Heartbeat") {
      this.formUrl.disable();
      this.formExpectedStatus.disable();
      this.formExpectedBody.disable();
      this.formTimeout.disable();
    } else if (this.formMonitorType.value === "Ping") {
      this.formExpectedStatus.disable();
      this.formExpectedBody.disable();
    } else if (this.formMonitorType.value === "TCP Port") {
      this.formUrl.setValidators(portUrlValidators);
      this.formExpectedStatus.disable();
      this.formExpectedBody.disable();
      if (this.formUrl.value === "https://") {
        this.formUrl.setValue("");
      }
    }
  }

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  submit() {
    if (this.monitorForm.valid) {
      this.formSubmitted.emit({
        ...this.monitorForm.value,
        name: this.formName.value!,
        interval: this.formInterval.value,
        monitorType: this.formMonitorType.value!,
        project: this.formProject.value ? this.formProject.value : null,
        environmentID: this.formEnvironment.value,
        expectedStatus: this.formExpectedStatus.enabled
          ? this.formExpectedStatus.value
          : null,
        expectedBody: this.formExpectedBody.value!,
        url: this.formUrl.enabled ? this.formUrl.value : "",
        timeout: this.formTimeout.value,
      });
    }
  }
}
