import {
  Component,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
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
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { EmailsService } from "src/app/api/emails/emails.service";
import { StatusPillComponent } from "src/app/shared/status-pill/status-pill.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  selector: "gt-manage-emails",
  templateUrl: "./manage-emails.html",
  styleUrls: ["./manage-emails.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    StatusPillComponent,
    FormErrorComponent,
    LoadingButtonComponent,
    MatMenuModule,
    ListComponent,
    ListRowComponent,
    SettingsSectionComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ManageEmails {
  #service = inject(EmailsService);
  #dialog = inject(MatDialog);

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

  actionsForLabel = (email: string) => $localize`Actions for ${email}:email:`;

  /** True while a request for this address is in flight. */
  isBusy(email: string) {
    const states = this.loadingStates();
    return (
      states.delete === email ||
      states.makePrimary === email ||
      states.resendConfirmation === email
    );
  }

  deleteEmail(email: string) {
    this.#dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Remove ${email}:email:?`,
          message: $localize`It is removed from your account.`,
          confirmText: $localize`Remove`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.#service.removeEmailAddress(email);
      });
  }
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
