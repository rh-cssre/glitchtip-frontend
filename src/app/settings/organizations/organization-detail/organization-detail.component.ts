import { Component } from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"]
})
export class OrganizationDetailComponent {
  activeOrganizationDetail$ = this.organizationService
    .activeOrganizationDetail$;

  constructor(private organizationService: OrganizationsService) {}

  removeOrganization() {
    // this.organizationsService.deleteOrganization(this.organization.slug);
    // show first org in list or if none, empty screen
  }
}
