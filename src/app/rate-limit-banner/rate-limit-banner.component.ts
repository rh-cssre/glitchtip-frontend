import { Component, ChangeDetectionStrategy } from "@angular/core";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { map } from "rxjs/operators";

@Component({
  selector: "gt-rate-limit-banner",
  templateUrl: "./rate-limit-banner.component.html",
  styleUrls: ["./rate-limit-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateLimitBannerComponent {
  isAcceptingEvents$ = this.organizationsService.activeOrganization$.pipe(
    map((activeOrganization) => activeOrganization?.isAcceptingEvents)
  );
  activeOrgSlug$ = this.organizationsService.activeOrganizationSlug$;
  bannerVisible = true;

  constructor(private organizationsService: OrganizationsService) {}

  hideBanner() {
    this.bannerVisible = false;
  }
}
