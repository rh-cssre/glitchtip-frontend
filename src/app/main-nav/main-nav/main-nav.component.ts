import {
  Component,
  ChangeDetectionStrategy,
  NgZone,
  HostListener
} from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent {
  innerWidth: number;
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  organizations$ = this.organizationsService.organziations$;

  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(private organizationsService: OrganizationsService) {
    this.organizationsService.retrieveOrganizations().subscribe();
  }

  isScreenSmall() {
    return this.innerWidth < 720;
  }

  setOrganization(id: number) {
    this.organizationsService.retrieveOrganizationDetail(id);
  }
}
