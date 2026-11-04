import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { ApiRow, KeyRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Documents the app's form conventions: outline fields, per-control mat-error
 * blocks, and server-error mapping through `mapFormErrors` + `gt-form-error`.
 */
@Component({
  selector: "preview-forms",
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormErrorComponent,
    LoadingButtonComponent,
    PanelComponent,
    SettingsSectionComponent,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      form {
        max-width: 420px;
      }
      .field-demo {
        width: 200px;
      }
      .field-demo mat-form-field {
        width: 100%;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Forms"
      status="stable"
      description="The conventions every form in the app follows: outline fields with labels, one mat-error block per control with a case for each failure, and server-side field errors mapped onto the same controls so client and server validation read identically."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="mat-form-field ties the input and its error together for screen readers, and the section title labels a lone field through aria-labelledby. Submit stays enabled until the request is in flight; validation errors are announced on the field, not in a toast."
      [keyboard]="keyboard"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Live example</div>
        <p class="preview-section__note">
          Submit with an empty email to see client-side validation. "Simulate
          server error" maps a backend field error onto the same controls via
          mapFormErrors, plus a form-level message through gt-form-error.
        </p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <gt-panel class="gt-form-panel">
            <gt-settings-section #email title="Email">
              <mat-form-field appearance="outline" subscriptSizing="dynamic">
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  [attr.aria-labelledby]="email.titleId"
                />
                <mat-error>
                  @if (form.controls.email.errors?.["required"]) {
                    <span>An email is required</span>
                  }
                  @if (form.controls.email.errors?.["email"]) {
                    <span>Enter a valid email address</span>
                  }
                  @if (form.controls.email.errors?.["serverError"]) {
                    <span>{{ form.controls.email.errors?.["serverError"] }}</span>
                  }
                </mat-error>
              </mat-form-field>
            </gt-settings-section>
            <gt-settings-section #displayName title="Display name">
              <mat-form-field appearance="outline" subscriptSizing="dynamic">
                <input
                  matInput
                  type="text"
                  formControlName="name"
                  [attr.aria-labelledby]="displayName.titleId"
                />
              </mat-form-field>
            </gt-settings-section>
            <gt-form-error [errors]="formErrors()" />
            <button slot="footer" mat-button type="button" (click)="simulateServerError()">
              Simulate server error
            </button>
            <gt-loading-button
              slot="footer"
              buttonText="Save profile"
              buttonStyle="stroked"
              [loading]="saving()"
              (buttonClick)="onSubmit()"
            />
          </gt-panel>
        </form>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Default field</div>
        <p class="preview-section__note">
          Every field gets the house look from the theme: 14px text, a 4px
          radius and a mid-tone outline that keeps 3:1 contrast. Filters in
          the top app bar are ghost selects, not fields (see Top app bar).
        </p>
        <div class="field-demo">
          <mat-form-field appearance="outline">
            <mat-label>Project name</mat-label>
            <input matInput value="checkout-api" />
          </mat-form-field>
        </div>
      </div>
    </preview-doc>
  `,
})
export class FormsPreview {
  readonly form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    name: new FormControl(""),
  });
  readonly formErrors = signal<string[]>([]);
  readonly saving = signal(false);

  readonly whenToUse = [
    "Every create/edit surface (settings, auth, project config)",
    "Anywhere the backend can reject a field with a message",
  ];
  readonly dos = [
    'Use appearance="outline" and a visible label on every field. When a field is the only control in a settings section, the section title is its label (aria-labelledby)',
    "Cover each failure case with its own @if inside one mat-error",
    "Map backend field errors with mapFormErrors so they render like client errors",
    "Put gt-form-error at the bottom of the form panel's body for errors that belong to no field",
    "Submit a create form with a filled button that names the object: Create project. A settings section saves with an outlined Save name",
    "Make a form with one submit one gt-panel class=\"gt-form-panel\": a section per field, then gt-form-error, with Cancel and the submit in its footer. An edit form's Delete is a danger panel below it",
    "Disable submit only while its request is in flight, with the spinner as the reason",
    "Show why an action is blocked as visible text, with the control disabled beside it or hidden",
    "Make a filter in the top app bar a ghost select (see Top app bar), not a form field",
  ];
  readonly donts = [
    "Surface validation failures in a snackbar",
    "Gate submit by permission (see Permission gating: hide, never disable)",
    "Give a blocked action's reason only in a tooltip",
    "Restyle a field with ::ng-deep or .mat-mdc-* classes",
  ];
  readonly content = [
    "Label every field with a noun, in sentence case: Email, Display name",
    "Write the error as an instruction: Enter a valid email address, not Invalid",
    "Say what to do, not just what is wrong",
    "Keep server messages in the same voice as the client ones",
  ];
  readonly keyboard: KeyRow[] = [
    { keys: "Tab / Shift+Tab", description: "Move between fields and the submit button" },
    { keys: "Enter", description: "Submit the form from any field" },
  ];
  readonly composition = {
    within: ["Detail page"],
    contains: ["Panel", "Settings section", "Buttons & actions", "Loading button"],
  };
  readonly api: ApiRow[] = [
    { name: "gt-form-error errors", type: "string | string[] | null", default: "", description: "Non-field error messages rendered as mat-error lines; renders nothing when empty" },
    { name: "mapFormErrors(fieldErrors, form)", type: "utility", default: "", description: "Sets serverError on each named control from a backend field-error map" },
  ];
  readonly importCode = `import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";`;
  readonly code = `<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <gt-panel class="gt-form-panel">
    <gt-settings-section #email title="Email">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <input matInput type="email" formControlName="email" [attr.aria-labelledby]="email.titleId" />
        <mat-error>
          @if (email?.errors?.required) { <span>An email is required</span> }
          @if (email?.errors?.serverError) { <span>{{ email?.errors?.serverError }}</span> }
        </mat-error>
      </mat-form-field>
    </gt-settings-section>
    <gt-form-error [errors]="formErrors()" />
    <a slot="footer" mat-button routerLink="..">Cancel</a>
    <gt-loading-button slot="footer" buttonText="Save profile" buttonStyle="stroked" [loading]="saving()" />
  </gt-panel>
</form>`;

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    this.formErrors.set([]);
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1000);
  }

  simulateServerError(): void {
    mapFormErrors(
      { email: ["A user with this email already exists."] },
      this.form,
    );
    this.form.controls.email.markAsTouched();
    this.formErrors.set(["Fix the errors above and try again."]);
  }
}
