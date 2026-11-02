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
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      form {
        max-width: 420px;
      }
      .demo-actions {
        display: flex;
        gap: var(--gt-space-3);
        align-items: center;
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
      a11y="mat-form-field ties the label, input and error together for screen readers. Submit stays enabled until the request is in flight; validation errors are announced on the field, not in a toast."
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
          <gt-form-error [errors]="formErrors()" />
          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
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
          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Display Name</mat-label>
            <input matInput type="text" formControlName="name" />
          </mat-form-field>
          <div class="demo-actions">
            <gt-loading-button
              buttonText="Save"
              [loading]="saving()"
              (buttonClick)="onSubmit()"
            />
            <button mat-stroked-button type="button" (click)="simulateServerError()">
              Simulate server error
            </button>
          </div>
        </form>
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
    'Use appearance="outline" and a mat-label on every field',
    "Cover each failure case with its own @if inside one mat-error",
    "Map backend field errors with mapFormErrors so they render like client errors",
    "Put gt-form-error at the top of the form for non-field errors",
    "Disable submit only for transient state (in flight), with the spinner as the reason",
  ];
  readonly donts = [
    "Surface validation failures in a snackbar",
    "Gate submit by permission (see Permission gating: hide, never disable)",
  ];
  readonly content = [
    "Label every field with a noun: Email, Display Name",
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
    contains: ["Buttons & actions", "Loading button"],
  };
  readonly api: ApiRow[] = [
    { name: "gt-form-error errors", type: "string[]", default: "", description: "Non-field error messages rendered as mat-error lines" },
    { name: "gt-form-error error", type: "any", default: "", description: "Deprecated. Do not use; pass errors instead" },
    { name: "mapFormErrors(fieldErrors, form)", type: "utility", default: "", description: "Sets serverError on each named control from a backend field-error map" },
  ];
  readonly importCode = `import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";`;
  readonly code = `<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <gt-form-error [errors]="formErrors()" />
  <mat-form-field class="full-width" appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" />
    <mat-error>
      @if (email?.errors?.required) { <span>An email is required</span> }
      @if (email?.errors?.serverError) { <span>{{ email?.errors?.serverError }}</span> }
    </mat-error>
  </mat-form-field>
  <gt-loading-button buttonText="Save" [loading]="saving()" />
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
    this.formErrors.set(["Please correct the errors below and try again."]);
  }
}
