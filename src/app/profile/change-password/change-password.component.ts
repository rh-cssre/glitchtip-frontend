import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import {
  Validators,
  FormGroupDirective,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { toObservable } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PasswordService, PasswordState } from "./password.service";
import { UserService } from "src/app/api/user/user.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { InputMatcherDirective } from "../../shared/input-matcher.directive";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";

@Component({
  selector: "gt-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    MatIconModule,
    FormErrorComponent,
  ],
})
export class ChangePasswordComponent
  extends StatefulComponent<PasswordState, PasswordService>
  implements OnInit
{
  protected service: PasswordService;
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);

  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;
  user = this.userService.user;
  loading = this.service.loading;
  passwordResetSuccess = this.service.success;
  formErrors = this.service.formErrors;
  fieldErrors = this.service.fieldErrors;

  form = new FormGroup({
    current_password: new FormControl("", []),
    new_password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    new_password2: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get current_password() {
    return this.form.get("current_password");
  }

  get new_password() {
    return this.form.get("new_password");
  }

  get new_password2() {
    return this.form.get("new_password2");
  }

  constructor() {
    const service = inject(PasswordService);

    toObservable(service.fieldErrors).subscribe((fieldErrors) =>
      mapFormErrors(fieldErrors, this.form),
    );
    super(service);

    this.service = service;
  }

  ngOnInit() {
    this.userService.getUserDetails();
  }

  async onSubmit() {
    if (this.form.valid) {
      const result = await this.service.changePassword(
        this.form.value.current_password!,
        this.form.value.new_password!,
      );
      if (result) {
        this.snackBar.open($localize`Your new password has been saved.`);
        this.form.reset();
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key)!.setErrors(null);
        });
      }
    }
  }
}
