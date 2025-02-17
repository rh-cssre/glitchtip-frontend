import { ChangeDetectionStrategy, Component, signal, inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";
import { OrganizationsService } from "../api/organizations.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

@Component({
  selector: "gt-new-organizations",
  templateUrl: "./new-organization.component.html",
  styleUrls: ["./new-organization.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
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

  canCreateOrg$ = combineLatest([
    toObservable(this.userDetails),
    toObservable(this.organizationCount),
    toObservable(this.settingsService.enableOrganizationCreation),
  ]).pipe(
    map(([user, orgCount, enableOrgCreation]) => {
      return enableOrgCreation || user?.isSuperuser || orgCount === 0;
    })
  );

  contextLoaded$ = combineLatest([
    toObservable(this.settingsService.initialLoad),
    toObservable(this.organizationsService.initialLoad),
    toObservable(this.userDetails),
  ]).pipe(
    map(([settingsLoaded, orgsLoaded, user]) => {
      return settingsLoaded && orgsLoaded && !!user;
    })
  );

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
