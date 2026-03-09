import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { SettingsService } from "src/app/api/settings.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";

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
  styleUrls: ["./new-member.component.scss"],
  imports: [
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    LoadingButtonComponent,
  ],
})
export class NewMemberComponent implements OnInit, OnDestroy {
  private organizationsService = inject(OrganizationDetailService);
  private route = inject(ActivatedRoute);
  private settingsService = inject(SettingsService);

  enableUserRegistration = this.settingsService.enableUserRegistration;
  organizationTeams = this.organizationsService.organizationTeams;
  filteredOrganizationTeams =
    this.organizationsService.filteredOrganizationTeams;
  errors = this.organizationsService.errors;
  loading = this.organizationsService.loading;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, emailsValidator]),
    role: new FormControl("", [Validators.required]),
    teams: new FormControl([]),
  });
  formRole = this.form.get("role") as FormControl;

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
