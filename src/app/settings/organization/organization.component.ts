import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { tap, take } from "rxjs/operators";
import { OrganizationDetailService } from "../../api/organizations/organization-detail.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatDialog } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { OrganizationsService } from "src/app/api/organizations.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";

@Component({
  selector: "gt-organization",
  templateUrl: "./organization.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
    TopAppBar,
    SettingsSectionComponent,
    FormErrorComponent,
    PageHeaderComponent,
  ],
})
export class OrganizationComponent implements OnDestroy, OnInit {
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private dialog = inject(MatDialog);

  activeOrganizationDetail = this.organizationsService.activeOrganization;
  initialLoad$ = toObservable(this.organizationDetailService.initialLoad);
  activeOrganizationDetail$ = toObservable(this.activeOrganizationDetail);
  loading = this.organizationDetailService.loading;
  errors = this.organizationDetailService.errors;
  form = new FormGroup({
    name: new FormControl(""),
  });
  canWriteOrg = this.organizationsService.canWriteOrg;
  canAdminOrg = this.organizationsService.canAdminOrg;

  ngOnInit() {
    // Ignore first load, on subsequent inits refresh org data
    this.initialLoad$
      .pipe(
        take(1),
        tap((initialLoad) => {
          if (initialLoad) {
            // this.organizationsService.retrieveOrganizations().toPromise();
            this.organizationsService.refreshActiveOrganization();
          }
        }),
      )
      .toPromise();
    this.activeOrganizationDetail$.subscribe((data) => {
      this.organizationDetailService.resetLoadingState();
      if (data) {
        this.form.patchValue({ name: data.name });
      }
    });
  }

  async updateOrganization() {
    await this.organizationDetailService.updateOrganization(
      this.form.value.name!,
    );
    if (this.errors().updateOrganization) {
      mapFormErrors({ name: [this.errors().updateOrganization] }, this.form);
    }
  }

  removeOrganization(slug: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete ${name}:name:?`,
        message: $localize`Its projects, teams and events are deleted too. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.organizationDetailService.deleteOrganization(slug, name);
      }
    });
  }

  ngOnDestroy(): void {
    this.organizationDetailService.resetLoadingState();
  }
}
