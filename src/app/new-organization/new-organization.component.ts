import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { tap, withLatestFrom } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";

@Component({
  selector: "gt-new-organizations",
  templateUrl: "./new-organization.component.html",
  styleUrls: ["./new-organization.component.scss"],
})
export class NewOrganizationsComponent {
  organizationCount$ = this.organizationsService.organizationCount$;
  enableUserRegistration$ = this.settingsService.enableUserRegistration$;
  userDetails$ = this.userService.userDetails$;
  loading = false;
  error: string | undefined;
  form = new UntypedFormGroup({
    name: new UntypedFormControl("", [Validators.required]),
  });
  constructor(
    private organizationsService: OrganizationsService,
    private settingsService: SettingsService,
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.organizationsService
        .createOrganization(this.form.value.name)
        .pipe(
          withLatestFrom(this.settingsService.billingEnabled$),
          tap(([organization, billingEnabled]) => {
            if (billingEnabled) {
              this.router.navigate([
                organization.slug,
                "settings",
                "subscription",
              ]);
            } else {
              this.router.navigate(["/"]);
            }
          })
        )
        .toPromise();
    }
  }
}
