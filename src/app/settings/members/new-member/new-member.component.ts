import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { LessAnnoyingErrorStateMatcher } from "../../../shared/less-annoying-error-state-matcher";

/** Custom validator to vaildate emails separated by commas */
function validateEmails(emails: string) {
  return (
    emails
      .split(",")
      .map((email) =>
        Validators.email({
          value: email.replace(/\s/g, ""),
        } as AbstractControl)
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
  selector: "app-new-member",
  templateUrl: "./new-member.component.html",
  styleUrls: ["./new-member.component.scss"],
})
export class NewMemberComponent implements OnInit {
  organizationTeams$ = this.organizationsService.organizationTeams$;
  filteredOrganizationTeams$ = this.organizationsService
    .filteredOrganizationTeams$;
  errors$ = this.organizationsService.errors$;
  loading$ = this.organizationsService.loading$;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, emailsValidator]),
    role: new FormControl("", [Validators.required]),
    teams: new FormControl([]),
  });

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(map((params) => params["org-slug"] as string))
      .subscribe((slug) => {
        this.organizationsService.retrieveOrganizationTeams(slug);
      });

    this.form.patchValue({ role: "member" });
  }

  onSubmit() {
    if (this.form.valid) {
      const emails = this.form.get("email")?.value;
      const role = this.form.get("role")?.value;
      const teams = this.form.get("teams")?.value;

      emails.split(",").map((email: string) => {
        this.organizationsService.inviteOrganizationMembers(
          email.replace(/\s/g, ""),
          teams,
          role
        );
      });
    }
  }
}
