import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  AbstractControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { EmailService } from "../../api/emails/email.service";
import { map, first } from "rxjs/operators";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { AsyncPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-manage-emails",
  templateUrl: "./manage-emails.component.html",
  styleUrls: ["./manage-emails.component.scss"],
  standalone: true,
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
    AsyncPipe,
  ],
})
export class ManageEmailsComponent implements OnInit {
  emailAddresses$ = this.emailService.emailAddressesSorted$;
  loadingStates$ = this.emailService.loadingStates$;
  addEmailError$ = this.emailService.addEmailError$;
  resetFormSubject = this.emailService.resetFormSubject;

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
  matchesExistingValidator = (control: AbstractControl) =>
    this.emailAddresses$.pipe(
      map((emails) => {
        const matchedEmail = emails.find(
          (email) => email.email === control.value,
        );
        return matchedEmail ? { matchesExistingValidator: true } : null;
      }),
      first(),
    );

  // tslint:disable:member-ordering
  form = new FormGroup({
    email_address: new FormControl(
      "",
      [Validators.email, Validators.required],
      this.matchesExistingValidator,
    ),
  });

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.emailService.retrieveEmailAddresses();
    this.resetFormSubject.subscribe((_) => this.formDirective.resetForm());
  }

  deleteEmail = (email: string) => this.emailService.removeEmailAddress(email);
  makePrimary = (email: string) => this.emailService.makeEmailPrimary(email);
  resendConfirmation = (email: string) =>
    this.emailService.resendConfirmation(email);

  onSubmit() {
    if (this.form.valid) {
      this.emailService.addEmailAddress(this.form.value.email_address!);
    }
  }
}
