import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { ResetPasswordService } from "src/app/api/reset-password/reset-password.service";

@Component({
  selector: "gt-set-new-password",
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetNewPasswordComponent {
  params$ = this.activatedRoute.params.pipe(
    map((params) => ({ uid: params.uidb64, token: params.token }))
  );
  setNewPasswordError$ = this.resetService.setNewPasswordError$;
  setnewPasswordLoading$ = this.resetService.setNewPasswordLoading$;
  form = new UntypedFormGroup({
    new_password1: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    new_password2: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get new_password1() {
    return this.form.get("new_password1");
  }

  get new_password2() {
    return this.form.get("new_password2");
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private resetService: ResetPasswordService
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.params$
        .pipe(
          map((params) => {
            this.resetService.setNewPassword(
              this.form.value.new_password1,
              this.form.value.new_password2,
              params.uid,
              params.token
            );
          })
        )
        .subscribe();
    }
  }
}
