import { Component } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"],
})
export class OrganizationsComponent {
  organizations$ = this.organizationsService.organizations$;

  constructor(private organizationsService: OrganizationsService) {}

  onSelected(orgId: number) {
    this.organizationsService.changeActiveOrganization(orgId);
  }

  removeOrganization(slug: string) {
    this.organizationsService.deleteOrganization(slug);
  }
}
