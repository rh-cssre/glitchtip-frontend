import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { tap, take } from "rxjs/operators";
import { OrganizationDetailService } from "../../api/organizations/organization-detail.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatDialog } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { OrganizationsService } from "src/app/api/organizations.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "gt-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.scss"],
  imports: [
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
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

  get name() {
    return this.form.get("name");
  }

  updateOrganization() {
    this.organizationDetailService.updateOrganization(this.form.value.name!);
  }

  removeOrganization(slug: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      restoreFocus: false,
      height: "225px",
      width: "375px",
      data: {
        title: $localize`Remove organization`,
        message: $localize`Are you sure you want to remove ${name}? You will permanently lose all projects and teams associated with it.`,
        confirmText: $localize`Remove`,
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
