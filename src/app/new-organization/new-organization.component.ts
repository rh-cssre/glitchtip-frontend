import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { combineLatest } from "rxjs";
import { map, tap, withLatestFrom } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-new-organizations",
  templateUrl: "./new-organization.component.html",
  styleUrls: ["./new-organization.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class NewOrganizationsComponent implements OnDestroy {
  organizationCount$ = this.organizationsService.organizationCount$;
  userDetails$ = this.userService.userDetails$;
  error$ = this.organizationsService.errors$.pipe(
    map((errors) => errors.createOrganization),
  );

  canCreateOrg$ = combineLatest([
    this.userDetails$,
    this.organizationCount$,
    this.settingsService.enableOrganizationCreation$,
  ]).pipe(
    map(([user, orgCount, enableOrgCreation]) => {
      return enableOrgCreation || user?.isSuperuser || orgCount === 0;
    }),
  );

  contextLoaded$ = combineLatest([
    this.settingsService.initialLoad$,
    this.organizationsService.initialLoad$,
    this.userDetails$,
  ]).pipe(
    map(([settingsLoaded, orgsLoaded, user]) => {
      return settingsLoaded && orgsLoaded && !!user;
    }),
  );

  loading = false;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });
  constructor(
    private organizationsService: OrganizationsService,
    private settingsService: SettingsService,
    private userService: UserService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.organizationsService
        .createOrganization(this.form.value.name!)
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
          }),
        )
        .toPromise();
    }
  }

  ngOnDestroy() {
    this.organizationsService.clearErrorState();
  }
}
