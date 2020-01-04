import {
  Component,
  ChangeDetectionStrategy,
  HostListener
} from "@angular/core";
import { MatSidenav } from "@angular/material";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { AuthService } from "src/app/api/auth/auth.service";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent {
  innerWidth: number;
  sidenav: MatSidenav;
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  organizations$ = this.organizationsService.organizations$;
  isLoggedIn$ = this.auth.isLoggedIn;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private organizationsService: OrganizationsService,
    private auth: AuthService
  ) {}

  isScreenSmall() {
    return this.innerWidth < 720;
  }

  setOrganization(id: number) {
    this.organizationsService.changeActiveOrganization(id);
  }
}
