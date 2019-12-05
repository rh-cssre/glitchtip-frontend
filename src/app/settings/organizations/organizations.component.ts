import { Component, OnInit } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent implements OnInit {
  organizations: any;
  constructor(private organizationsService: OrganizationsService) {}

  ngOnInit() {
    this.organizationsService
      .retrieveOrganizations()
      .subscribe(organizations => {
        this.organizations = organizations;
      });
  }
}
