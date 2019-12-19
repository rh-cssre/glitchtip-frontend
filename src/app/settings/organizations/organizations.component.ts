import { Component } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent {
  organizations$ = this.organizationsService.organziations$;

  constructor(
    private organizationsService: OrganizationsService,
    private router: Router
  ) {
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
