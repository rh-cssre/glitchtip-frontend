import { Component } from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-new-organizations",
  templateUrl: "./new-organizations.component.html",
  styleUrls: ["./new-organizations.component.scss"]
})
export class NewOrganizationsComponent {
  loading = false;
  error: string;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    slug: new FormControl(""),
    agreeTerms: new FormControl("True", [Validators.required])
  });
  constructor(
    private organizationsService: OrganizationsService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.organizationsService
        .createOrganization({
          name: this.form.value.name,
          slug: this.form.value.slug,
          agreeTerms: this.form.value.agreeTerms
        })
        .subscribe(
          organization =>
            this.router.navigate([
              "settings",
              "organizations",
              organization.slug
            ]),
          err => {
            this.loading = false;
            this.error = "Error";
          }
        );
    }
  }
}
