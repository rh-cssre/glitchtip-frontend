import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from "@angular/core";
import { UserService } from "src/app/api/user/user.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { EmailAddress } from "src/app/api/user/user.interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-manage-emails",
  templateUrl: "./manage-emails.component.html",
  styleUrls: ["./manage-emails.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEmailsComponent implements OnInit {
  emailAddresses$ = this.userService.emailAddressesSorted$;
  emailAddresses: EmailAddress[];

  loadingStates: { [key: string]: boolean } = {
    add: false,
    // delete: false,
    // makePrimary: false,
  };

  addEmailError = "";

  get email_address() {
    return this.form.get("email_address");
  }
  /**
   * Best I can tell, this is necessary instead of this.form.reset() because of
   * Angular Material
   */
  @ViewChild(FormGroupDirective) formDirective;

  /**
   * Disabling lint was the path of least resistance:
   * - If I didn't make this as an arrow function, then `this` was undefined
   *   for `this.emailAddresses`
   * - If I changed this.matchesExistingValidator in `new FormControl` to pass
   *   in the email address list and avoid `this`, it wouldn't work because it
   *   doesn't reinitialize when you get an updated list of email addresses
   * - Arrow function works fine, but making the change made TypeScript mad
   *   because it wants the method to be declared before using it
   * - But putting it above make lint mad because then `form` is coming after an
   *   instance declaration method
   * - Also, when there's an arrow function, prettier puts a semicolon at the
   *   end which lint doesn't like. What a day
   */
  /* tslint:disable */

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

  form = new FormGroup({
    email_address: new FormControl("", [
      Validators.email,
      Validators.required,
      this.matchesExistingValidator,
    ]),
  });
  /* tslint:enable */

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
    this.userService
      .removeEmailAddress(email)
      .then((_) =>
        this.snackBar.open(
          `${email} has been removed from your account.`,
          undefined,
          { duration: 4000 }
        )
      );
  }

  makePrimary(email: string) {
    this.userService
      .makeEmailPrimary(email)
      .then(() =>
        this.snackBar.open(
          `${email} is now your primary email address.`,
          undefined,
          { duration: 4000 }
        )
      );
  }

  onSubmit() {
    if (this.form.valid) {
      this.loadingStates.new = true;
      this.userService.addEmailAddress(this.form.value.email_address).then(
        (_) => {
          this.formDirective.resetForm();
          this.loadingStates.new = false;
          this.addEmailError = "";
        },
        (error) => {
          console.log("err", error);
          this.loadingStates.new = false;
          if (
            error.status === 500 &&
            (error.error as string).includes(
              `'to' parameter is not a valid address`
            )
          ) {
            this.addEmailError =
              "This is not a valid email address. Please try another one.";
          }
          // if (err.status === 400 && err.error.old_password) {
          //   this.error = "Your current password is incorrect.";
          // } else {
          //   this.error = "Error: " + err.statusText;
          // }
        }
      );
    }
  }
}
