import { Component, OnInit } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, FormGroup } from "@angular/forms";
import { OrganizationDetail } from "src/app/api/organizations/organizations.interface";

@Component({
  selector: "app-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.scss"],
})
export class OrganizationComponent implements OnInit {
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  updateError = "";
  updateLoading = false;
  deleteError = "";
  deleteLoading = false;
  form = new FormGroup({
    name: new FormControl(""),
  });

  constructor(
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar
  ) {
    this.organizationsService.retrieveOrganizations().subscribe();
  }

  ngOnInit() {
    this.activeOrganizationDetail$.subscribe((data) =>
      data ? this.form.patchValue({ name: data.name }) : undefined
    );
  }

  get name() {
    return this.form.get("name");
  }

  updateOrganization() {
    this.updateLoading = true;
    this.organizationsService
      .updateOrganization(this.form.value.name)
      .subscribe(
        (org: OrganizationDetail) => {
          this.updateLoading = false;
          this.snackBar.open(
            `The name of your organization has been updated to ${org.name}`,
            undefined,
            {
              duration: 4000,
            }
          );
        },
        (err) => {
          this.updateLoading = false;
          this.updateError = `${err.statusText}: ${err.status}`;
        }
      );
  }

  removeOrganization(slug: string, name: string) {
    if (
      window.confirm(
        `Are you sure you want to remove ${name}? You will permanently lose all projects and teams associated with it.`
      )
    ) {
      this.deleteLoading = true;
      this.organizationsService.deleteOrganization(slug).subscribe(
        () => {
          this.deleteLoading = false;
          this.snackBar.open(
            `You have successfully deleted ${name} from your organizations`,
            undefined,
            {
              duration: 4000,
            }
          );
        },
        (err) => {
          this.deleteLoading = false;
          this.deleteError = "Error: " + err.statusText;
        }
      );
    }
  }
}
