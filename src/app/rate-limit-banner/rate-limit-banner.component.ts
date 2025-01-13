import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { map } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { OrganizationsService } from "../api/organizations.service";

@Component({
  selector: "gt-rate-limit-banner",
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: "./rate-limit-banner.component.html",
  styleUrls: ["./rate-limit-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateLimitBannerComponent {
  private organizationsService = inject(OrganizationsService);

  eventThrottleRate$ = this.organizationsService.activeOrganization$.pipe(
    map((activeOrganization) => activeOrganization?.eventThrottleRate)
  );
  activeOrgSlug$ = this.organizationsService.activeOrganizationSlug$;
  bannerVisible = true;

  hideBanner() {
    this.bannerVisible = false;
  }
}
