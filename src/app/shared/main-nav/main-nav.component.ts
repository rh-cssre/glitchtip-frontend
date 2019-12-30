import { Component, ChangeDetectionStrategy } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent {
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  organizations$ = this.organizationsService.organizations$;

  constructor(private organizationsService: OrganizationsService) {}

  setOrganization(id: number) {
    this.organizationsService.changeActiveOrganization(id);
  }
}
