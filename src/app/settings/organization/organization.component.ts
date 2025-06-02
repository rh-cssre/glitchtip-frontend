import { Component, OnInit, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { tap, take } from "rxjs/operators";
import { OrganizationDetailService } from "../../api/organizations/organization-detail.service";
import { Organization } from "src/app/api/organizations/organizations.interface";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { OrganizationsService } from "src/app/api/organizations.service";
import { toObservable } from "@angular/core/rxjs-interop";

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
export class OrganizationComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private snackBar = inject(MatSnackBar);

  activeOrganizationDetail = this.organizationsService.activeOrganization;
  initialLoad$ = toObservable(this.organizationDetailService.initialLoad);
  activeOrganizationDetail$ = toObservable(this.activeOrganizationDetail);
  updateError = "";
  updateLoading = false;
  deleteError = "";
  deleteLoading = false;
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
    this.activeOrganizationDetail$.subscribe((data) =>
      data ? this.form.patchValue({ name: data.name }) : undefined,
    );
  }

  get name() {
    return this.form.get("name");
  }

  updateOrganization() {
    this.updateLoading = true;
    this.organizationDetailService
      .updateOrganization(this.form.value.name!)
      .subscribe(
        (org: Organization) => {
          this.updateLoading = false;
          this.snackBar.open(
            `The name of your organization has been updated to ${org.name}`,
          );
        },
        (err) => {
          this.updateLoading = false;
          this.updateError = `${err.statusText}: ${err.status}`;
        },
      );
  }

  removeOrganization(slug: string, name: string) {
    if (
      window.confirm(
        `Are you sure you want to remove ${name}? You will permanently lose all projects and teams associated with it.`,
      )
    ) {
      this.deleteLoading = true;
      this.organizationDetailService.deleteOrganization(slug).then((result) => {
        if (result.response.status === 204) {
          this.deleteLoading = false;
          this.snackBar.open(
            `You have successfully deleted ${name} from your organizations`,
          );
        } else {
          this.deleteLoading = false;
          this.deleteError = "Error";
        }
      });
    }
  }
}
