import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ResetPasswordService } from "src/app/api/reset-password/reset-password.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-set-new-password",
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetNewPasswordComponent implements OnInit {
  params$ = this.activatedRoute.params.pipe(
    map((params) => ({ uid: params.uidb64, token: params.token }))
  );
  setNewPasswordError$ = this.resetService.setNewPasswordError$;
  setnewPasswordLoading$ = this.resetService.setNewPasswordLoading$;
  form = new FormGroup({
    new_password1: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    new_password2: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  matcher = new LessAnnoyingErrorStateMatcher();

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

  ngOnInit(): void {}

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
