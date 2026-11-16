import {
  Component,
  OnInit,
  OnDestroy,
  computed,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { SettingsService } from "src/app/api/settings.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { MEMBER_ROLES, roleDescription, roleName } from "../member-roles";
import { PanelComponent } from "src/app/shared/panel/panel.component";

/** Custom validator to vaildate emails separated by commas */
function validateEmails(emails: string) {
  return (
    emails
      .split(",")
      .map((email) =>
        Validators.email({
          value: email.replace(/\s/g, ""),
        } as AbstractControl),
      )
      .find((email) => email !== null) === undefined
  );
}

function emailsValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value === "" || !control.value || validateEmails(control.value)) {
    return null;
  }
  return { invalidEmails: true };
}

@Component({
  selector: "gt-new-member",
  templateUrl: "./new-member.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterLink,
    MatButtonModule,
    TopAppBar,
    BackLinkComponent,
    PageHeaderComponent,
    SettingsSectionComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    LoadingButtonComponent,
    FormErrorComponent,
    PanelComponent,
  ],
})
export class NewMemberComponent implements OnInit, OnDestroy {
  private organizationsService = inject(OrganizationDetailService);
  private route = inject(ActivatedRoute);
  private settingsService = inject(SettingsService);

  enableUserRegistration = this.settingsService.enableUserRegistration;
  organizationTeams = this.organizationsService.organizationTeams;
  errors = this.organizationsService.errors;
  loading = this.organizationsService.loading;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, emailsValidator]),
    role: new FormControl("", [Validators.required]),
    teams: new FormControl([]),
  });
  formRole = this.form.get("role") as FormControl;
  /** The backend refuses inviting above your own role; only owners outrank managers. */
  readonly canGrantOwner = inject(OrganizationsService).canAdminOrg;
  readonly roles = computed(() =>
    this.canGrantOwner()
      ? MEMBER_ROLES
      : MEMBER_ROLES.filter((role) => role !== "owner"),
  );
  roleName = roleName;
  roleDescription = roleDescription;

  ngOnInit(): void {
    this.route.params
      .pipe(map((params) => params["org-slug"] as string))
      .subscribe((slug) => {
        this.organizationsService.retrieveOrganizationTeams(slug);
      });

    this.form.patchValue({ role: "member" });
  }

  ngOnDestroy() {
    this.organizationsService.resetLoadingState();
  }

  onSubmit() {
    if (this.form.valid) {
      const emailString = this.form.get("email")?.value!;
      const role = this.form.get("role")?.value!;
      const teams = this.form.get("teams")?.value!;

      const emails = emailString
        ?.split(",")
        .map((email) => email.replace(/\s/g, ""));

      this.organizationsService.inviteOrganizationMembers(
        emails,
        teams,
        role as any,
      );
    }
  }
}
