import { Component, OnInit, ViewChild, effect, inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { AuthTokensService, AuthTokensState } from "../auth-tokens.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";

@Component({
  selector: "gt-new-token",
  templateUrl: "./new-token.component.html",
  styleUrls: ["./new-token.component.scss"],
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
  ],
})
export class NewTokenComponent
  extends StatefulComponent<AuthTokensState, AuthTokensService>
  implements OnInit
{
  protected service: AuthTokensService;
  private fb = inject(FormBuilder);

  @ViewChild("selectAllCheckbox") selectAllCheckbox?: MatCheckbox;

  createLoading = this.service.createLoading;
  createErrorForm = this.service.createErrorForm;

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
    return this.form.controls.scopes as FormArray;
  }

  get label() {
    return this.form.controls.label as FormControl;
  }

  constructor() {
    const service = inject(AuthTokensService);

    super(service);
    this.service = service;

    this.form = this.fb.group({
      label: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
      scopes: new FormArray([]),
    });

    /* Set scopeOptions to scopes FormArray **/
    this.scopeOptions.forEach(() => this.scopes.push(new FormControl(false)));

    effect(() => mapFormErrors(service.createErrorFields(), this.form));
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

  onSubmit() {
    this.validateScopes();

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
