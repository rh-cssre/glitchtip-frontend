import { Component, ChangeDetectionStrategy } from "@angular/core";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { map } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "gt-rate-limit-banner",
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink
],
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
