import { Component, ViewChild, inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  ReactiveFormsModule,
  AbstractControl,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { ManageEmailsState } from "./manage-emails-state";

@Component({
  selector: "gt-manage-emails",
  templateUrl: "./manage-emails.html",
  styleUrls: ["./manage-emails.scss"],
  imports: [
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    LoadingButtonComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [ManageEmailsState],
})
export class ManageEmails {
  #service = inject(ManageEmailsState);

  emailAddresses = this.#service.emailAddressesSorted;
  loadingStates = this.#service.loadingStates;
  addEmailError = this.#service.addEmailError;

  get email_address() {
    return this.form.get("email_address");
  }
  /**
   * To reset a form, the normal thing to do is this.form.reset(), but Material
   * doesn't allow this. So we do it another way, and we need this for that.
   * https://github.com/angular/components/issues/4190
   */
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  /**
   * Does the email address match something already on the list?
   * If so, throw an error.
   *
   * @param control The form control being validated
   */
  matchesExistingValidator = (control: AbstractControl) => {
    const matchedEmail = this.emailAddresses().find(
      (email) => email.email === control.value,
    );
    return matchedEmail ? { matchesExistingValidator: true } : null;
  };

  form = new FormGroup({
    email_address: new FormControl("", [
      Validators.email,
      Validators.required,
      this.matchesExistingValidator,
    ]),
  });

  deleteEmail = (email: string) => this.#service.removeEmailAddress(email);
  makePrimary = (email: string) => this.#service.makeEmailPrimary(email);
  resendConfirmation = (email: string) =>
    this.#service.resendConfirmation(email);

  async onSubmit() {
    if (this.form.valid) {
      const success = await this.#service.addEmailAddress(
        this.form.value.email_address!,
      );
      if (success) {
        this.formDirective.resetForm();
        this.form.reset();
      }
    }
  }
}
