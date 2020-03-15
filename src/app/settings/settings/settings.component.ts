import { Component } from "@angular/core";
import { SettingsService } from "src/app/api/settings.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {
  billingEnabled$ = this.service.billingEnabled$;
  organizationSlug$ = this.organizationService.activeOrganizationSlug$;
  constructor(
    private service: SettingsService,
    private organizationService: OrganizationsService
  ) {}
}
