import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  UntypedFormArray,
  FormControl,
  Validators,
  UntypedFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { AuthTokensService, AuthTokensState } from "../auth-tokens.service";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { AsyncPipe } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-new-token",
  templateUrl: "./new-token.component.html",
  styleUrls: ["./new-token.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    LoadingButtonComponent,
    AsyncPipe,
  ],
})
export class NewTokenComponent
  extends StatefulBaseComponent<AuthTokensState, AuthTokensService>
  implements OnInit
{
  @ViewChild("selectAllCheckbox") selectAllCheckbox?: MatCheckbox;

  createLoading$ = this.service.createLoading$;
  createError$ = this.service.createError$;
  createErrorLabel$ = this.service.createErrorLabel$;
  createErrorScopes$ = this.service.createErrorScopes$;

  form: FormGroup;
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
    return this.form.controls.scopes as UntypedFormArray;
  }

  get label() {
    return this.form.controls.label as FormControl;
  }

  constructor(
    protected service: AuthTokensService,
    private fb: UntypedFormBuilder,
  ) {
    super(service);
    this.form = this.fb.group({
      label: new FormControl("", [Validators.required]),
      scopes: new UntypedFormArray([]),
    });

    /* Set scopeOptions to scopes FormArray **/
    this.scopeOptions.forEach(() => this.scopes.push(new FormControl(false)));
  }

  ngOnInit(): void {
    this.scopes.valueChanges.subscribe((values: boolean[]) => {
      if (this.selectAllCheckbox) {
        this.selectAllCheckbox.checked = values.every(
          (value) => value === true,
        );
        this.selectAllCheckbox.indeterminate =
          !this.selectAllCheckbox.checked &&
          values.filter((value) => value === true).length > 0;
      }
    });
  }

  bulkModifyScopes() {
    if (this.scopes.value.every((value: boolean) => value === false)) {
      this.scopes.setValue(Array.from(this.scopeOptions, () => true));
    } else {
      this.scopes.setValue(Array.from(this.scopeOptions, () => false));
    }
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
      (value: boolean) => value === true,
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
    this.service.resetCreateErrors();

    this.validateForm();

    if (this.form.valid) {
      const label = this.label.value;
      const selectedScopes = this.form.value.scopes
        .map((checked: boolean, index: number) =>
          checked ? this.scopeOptions[index] : null,
        )
        .filter((selected: string) => selected !== null);
      this.service.createAuthToken(label, selectedScopes);
    }
  }
}
