import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  computed,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { OrganizationsService } from "../api/organizations.service";
import { Router } from "@angular/router";
import { Autofocus } from "../shared/autofocus";

@Component({
  templateUrl: "./new-organization.component.html",
  styleUrls: ["./new-organization.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Autofocus,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewOrganizationsComponent {
  private organizationsService = inject(OrganizationsService);
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);
  private router = inject(Router);

  organizationCount = this.organizationsService.organizationsCount;
  userDetails = this.userService.user;
  error = signal<string | null>(null);

  canCreateOrg = computed(() => {
    const user = this.userDetails();
    const orgCount = this.organizationCount();
    const enableOrgCreation = this.settingsService.enableOrganizationCreation();
    return enableOrgCreation || user?.isSuperuser || orgCount === 0;
  });

  contextLoaded = computed(() => {
    const settingsLoaded = this.settingsService.initialLoad();
    const orgsLoaded = this.organizationsService.initialLoad();
    const user = this.userDetails();
    return settingsLoaded && orgsLoaded && !!user;
  });

  loading = false;
  form = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(200)]),
  });

  onSubmit() {
    this.error.set(null);
    if (this.form.valid) {
      this.loading = true;
      this.organizationsService
        .createOrganization(this.form.value.name!)
        .then(({ data, error }) => {
          if (error) {
            this.error.set(error);
          }
          if (data && this.settingsService.billingEnabled()) {
            this.router.navigate([data.slug, "settings", "subscription"]);
          } else {
            this.router.navigate(["/"]);
          }
        });
    }
  }
}
