import { Component, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { AuthTokensService } from "../auth-tokens.service";

@Component({
  selector: "app-new-token",
  templateUrl: "./new-token.component.html",
  styleUrls: ["./new-token.component.scss"],
})
export class NewTokenComponent implements OnDestroy {
  createLoading$ = this.authTokensService.createLoading$;
  createError$ = this.authTokensService.createError$;
  createErrorLabel$ = this.authTokensService.createErrorLabel$;
  createErrorScopes$ = this.authTokensService.createErrorScopes$;

  form: FormGroup;
  matcher = new LessAnnoyingErrorStateMatcher();
  scopeOptions: string[] = [
    "project:read",
    "project:write",
    "project:admin",
    "project:releases",
    "team:read",
    "team:write",
    "team:admin",
    "event:read",
    "event:write",
    "event:admin",
    "org:read",
    "org:write",
    "org:admin",
    "member:read",
    "member:write",
    "member:admin",
  ];

  get scopes() {
    return this.form.controls.scopes as FormArray;
  }

  get label() {
    return this.form.controls.label as FormControl;
  }

  constructor(
    private authTokensService: AuthTokensService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      label: new FormControl("", [Validators.required]),
      scopes: new FormArray([]),
    });

    /* Set scopeOptions to scopes FormArray **/
    this.scopeOptions.forEach(() => this.scopes.push(new FormControl(false)));
  }

  ngOnDestroy() {
    this.authTokensService.clear();
  }

  getLabelFieldError() {
    this.createErrorLabel$.subscribe((error) => {
      if (error) {
        return this.label.setErrors({
          serverErrorLabel: error,
        });
      }
    });
  }

  getScopesFieldError() {
    this.createErrorScopes$.subscribe((error) => {
      if (error) {
        return this.scopes.setErrors({
          serverErrorScopes: error,
        });
      }
    });
  }

  validateScopes() {
    /* Check to see if at least one scope is selected before submitting **/
    const valueSelected = this.scopes.value.find(
      (value: boolean) => value === true
    );
    if (!valueSelected) {
      this.scopes.setErrors({
        selectOne: true,
      });
    }
  }

  validateForm() {
    this.validateScopes();
    this.getLabelFieldError();
    this.getScopesFieldError();
  }

  onSubmit() {
    this.authTokensService.resetCreateErrors();

    this.validateForm();

    if (this.form.valid) {
      const label = this.label.value;
      const selectedScopes = this.form.value.scopes
        .map((checked: boolean, index: number) =>
          checked ? this.scopeOptions[index] : null
        )
        .filter((selected: string) => selected !== null);
      this.authTokensService.createAuthToken(label, selectedScopes);
    }
  }
}
