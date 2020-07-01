import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorStateMatcher } from "@angular/material/core";
import { EmailAddress } from "../../api/emails/email.interfaces";
import { EmailService } from "../../api/emails/email.service";

export class LessAnnoyingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form?.submitted);
  }
}

@Component({
  selector: "app-manage-emails",
  templateUrl: "./manage-emails.component.html",
  styleUrls: ["./manage-emails.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ManageEmailsComponent implements OnInit {
  emailAddresses$ = this.emailService.emailAddressesSorted$;
  loadingStates$ = this.emailService.loadingStates$;
  emailAddresses: EmailAddress[] = [];

  addEmailError = "";

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
   * Does the email address match something already on the list? If so, no need
   * to allow it.
   *
   * @param control The form control being validated
   */
  matchesExistingValidator = (control: FormControl) => {
    const matchedEmail = !!this.emailAddresses.find(
      (email) => email.email === control.value
    );

    return matchedEmail ? { matchesExistingValidator: true } : null;
  };

  // tslint:disable:member-ordering
  form = new FormGroup({
    email_address: new FormControl("", [
      Validators.email,
      Validators.required,
      this.matchesExistingValidator,
    ]),
  });

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private emailService: EmailService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.emailService.retrieveEmailAddresses();
    this.emailAddresses$.subscribe((emails) => {
      this.emailAddresses = emails;
    });
  }

  deleteEmail(email: string) {
    this.emailService.setLoadingDelete(email);
    this.emailService.removeEmailAddress(email).subscribe(
      (_) => {
        this.emailService.resetLoadingDelete();
        this.snackBar.open(
          `${email} has been removed from your account.`,
          undefined,
          { duration: 4000 }
        );
      },
      (_) => {
        this.emailService.resetLoadingDelete();
        this.snackBar.open(`There was a problem. Try again later.`, undefined, {
          duration: 4000,
        });
      }
    );
  }

  makePrimary(email: string) {
    this.emailService.setLoadingMakePrimary(email);
    this.emailService.makeEmailPrimary(email).subscribe(
      (_) => {
        this.emailService.resetLoadingMakePrimary();
        this.snackBar.open(
          `${email} is now your primary email address.`,
          undefined,
          { duration: 4000 }
        );
      },
      (_) => {
        this.emailService.resetLoadingMakePrimary();
        this.snackBar.open(`There was a problem. Try again later.`, undefined, {
          duration: 4000,
        });
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.emailService.setLoadingAdd();
      this.emailService
        .addEmailAddress(this.form.value.email_address)
        .subscribe(
          (_) => {
            this.formDirective.resetForm();
            this.emailService.resetLoadingAdd();
            this.addEmailError = "";
          },
          (error) => {
            this.emailService.resetLoadingAdd();
            if (error.error?.non_field_errors) {
              this.addEmailError = error.error.non_field_errors.join(", ");
            } else {
              if (
                error.status === 500 &&
                (error.error as string).includes(
                  `'to' parameter is not a valid address`
                )
              ) {
                this.addEmailError =
                  "This is not a valid email address. Please try another one.";
              } else if (error.status === 500) {
                this.addEmailError = `There was a problem. Refresh the page to see if your email is
                  on the list. You may need to try again, or try a different
                  email address.`;
              } else if (error.status === 400) {
                this.addEmailError = "There was a problem. Please try again.";
              } else {
                this.addEmailError = "Error: " + error.statusText;
              }
            }
          }
        );
    }
  }
}
