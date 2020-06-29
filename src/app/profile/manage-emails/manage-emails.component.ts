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
import { EmailAddress } from "src/app/api/user/user.interfaces";
import { UserService } from "src/app/api/user/user.service";

export class LessAnnoyingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form?.submitted);
  }
}

interface LoadingStates {
  add: boolean;
  /**
   * Theoretically you could be deleting two at once and the UI won't
   * reflect this. Didn't think it was a 1.0 problem
   */
  delete: string | null;
  /**
   * If you click one "Make primary" button and then another quickly, could
   * cause problems. Again, didn't think it was a 1.0 problem
   */
  makePrimary: string | null;
}

@Component({
  selector: "app-manage-emails",
  templateUrl: "./manage-emails.component.html",
  styleUrls: ["./manage-emails.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ManageEmailsComponent implements OnInit {
  emailAddresses$ = this.userService.emailAddressesSorted$;
  emailAddresses: EmailAddress[] | undefined;

  loadingStates: LoadingStates = {
    add: false,
    delete: null,
    makePrimary: null,
  };

  addEmailError = "";

  get email_address() {
    return this.form.get("email_address");
  }
  /**
   * Best I can tell, this is necessary instead of this.form.reset() because of
   * Angular Material
   */
  @ViewChild(FormGroupDirective) formDirective: any;

  /**
   * Does the email address match something already on the list? If so, no need
   * to allow it.
   *
   * @param control The form control being validated
   */
  matchesExistingValidator = (control: FormControl) => {
    const matchedEmail = this.emailAddresses
      ? !!this.emailAddresses.find((email) => email.email === control.value)
      : false;

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
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userService.retrieveEmailAddresses();
    this.emailAddresses$.subscribe((emails) => {
      this.emailAddresses = emails;
    });
  }

  deleteEmail(email: string) {
    this.loadingStates.delete = email;
    this.userService.removeEmailAddress(email).subscribe(
      (_) => {
        this.loadingStates.delete = null;
        this.snackBar.open(
          `${email} has been removed from your account.`,
          undefined,
          { duration: 4000 }
        );
      },
      (_) => {
        this.loadingStates.delete = null;
        this.snackBar.open(`There was a problem. Try again later.`, undefined, {
          duration: 4000,
        });
      }
    );
  }

  makePrimary(email: string) {
    this.loadingStates.makePrimary = email;
    this.userService.makeEmailPrimary(email).subscribe(
      (_) => {
        this.loadingStates.makePrimary = null;
        this.snackBar.open(
          `${email} is now your primary email address.`,
          undefined,
          { duration: 4000 }
        );
      },
      (_) => {
        this.loadingStates.makePrimary = null;
        this.snackBar.open(`There was a problem. Try again later.`, undefined, {
          duration: 4000,
        });
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.loadingStates.add = true;
      this.userService.addEmailAddress(this.form.value.email_address).subscribe(
        (_) => {
          this.formDirective.resetForm();
          this.loadingStates.add = false;
          this.addEmailError = "";
        },
        (error) => {
          this.loadingStates.add = false;
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
