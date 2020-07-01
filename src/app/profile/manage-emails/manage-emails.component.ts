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
  snackbarMessage$ = this.emailService.snackbarMessage$;
  addEmailError$ = this.emailService.addEmailError$;
  emailAddresses: EmailAddress[] = [];

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
    this.snackbarMessage$.subscribe((message) => {
      if (message !== "") {
        this.snackBar.open(message, undefined, { duration: 4000 });
      }
    });
  }

  deleteEmail = (email: string) => this.emailService.removeEmailAddress(email);
  makePrimary = (email: string) => this.emailService.makeEmailPrimary(email);

  onSubmit() {
    if (this.form.valid) {
      this.emailService.addEmailAddress(this.form.value.email_address);
    }
  }
}
