import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-new-organizations",
  templateUrl: "./new-organization.component.html",
  styleUrls: ["./new-organization.component.scss"]
})
export class NewOrganizationsComponent {
  loading = false;
  error: string;
  form = new FormGroup({
    name: new FormControl("", [Validators.required])
  });
  constructor(
    private organizationsService: OrganizationsService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.organizationsService
        .createOrganization(this.form.value.name)
        .subscribe(
          organization => this.router.navigate(["settings", organization.slug]),
          err => {
            this.loading = false;
            this.error = "Error";
          }
        );
    }
  }
}
