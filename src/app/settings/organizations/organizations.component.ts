import { Component } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent {
  organizations$ = this.organizationsService.organizations$;

  constructor(private organizationsService: OrganizationsService) {
    this.organizationsService.retrieveOrganizations().subscribe();
  }

  onSelected(orgId: number) {
    this.organizationsService.retrieveOrganizationDetail(orgId);
    // this.router.navigate(["./settings", orgSlug]);
  }

  removeOrganization(slug: string) {
    this.organizationsService.deleteOrganization(slug);
  }
}
