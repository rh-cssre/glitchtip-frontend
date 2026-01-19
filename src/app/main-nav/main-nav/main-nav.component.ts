import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from "@angular/core";
import { Router } from "@angular/router";
import { MainNavService } from "../main-nav.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { MobileNavToolbarComponent } from "../../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/auth.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from "@angular/material/select";

interface NavNode {
  name: string;
  route?: string[];
  requiresBilling?: boolean;
  requiresActiveOrg?: boolean;
  children?: NavNode[];
  useExactRoute?: boolean;
}

const MENU_DATA: NavNode[] = [
  {
    name: $localize`Issues`,
    route: ["org_slug", "issues"],
    requiresActiveOrg: true,
  },
  {
    name: $localize`Uptime Monitors`,
    route: ["org_slug", "uptime-monitors"],
    requiresActiveOrg: true,
  },
  {
    name: $localize`Performance`,
    route: ["org_slug", "performance"],
    requiresActiveOrg: true,
  },
  {
    name: $localize`Projects`,
    route: ["org_slug", "projects"],
    requiresActiveOrg: true,
  },
  {
    name: $localize`Releases`,
    route: ["org_slug", "releases"],
    requiresActiveOrg: true,
  },
  {
    name: $localize`Settings`,
    requiresActiveOrg: true,
    children: [
      {
        name: $localize`General settings`,
        route: ["org_slug", "settings"],
        requiresActiveOrg: true,
        useExactRoute: true,
      },
      {
        name: $localize`Projects`,
        route: ["org_slug", "settings", "projects"],
        requiresActiveOrg: true,
      },
      {
        name: $localize`Subscription`,
        route: ["org_slug", "settings", "subscription"],
        requiresBilling: true,
        requiresActiveOrg: true,
      },
      {
        name: $localize`Teams`,
        route: ["org_slug", "settings", "teams"],
        requiresActiveOrg: true,
      },
      {
        name: $localize`Members`,
        route: ["org_slug", "settings", "members"],
        requiresActiveOrg: true,
      },
    ],
  },
  {
    name: $localize`Profile`,
    useExactRoute: true,
    children: [
      { name: $localize`Account`, route: ["profile"], useExactRoute: true },
      { name: $localize`MFA`, route: ["profile", "multi-factor-auth"] },
      {
        name: $localize`Notifications`,
        route: ["profile", "notifications"],
      },
      { name: $localize`Auth Tokens`, route: ["profile", "auth-tokens"] },
    ],
  },
];

@Component({
  selector: "gt-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatTreeModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    RouterLinkActive,
    MatCardModule,
    MobileNavToolbarComponent,
  ],
})
export class MainNavComponent {
  private router = inject(Router);
  private mainNav = inject(MainNavService);
  private organizationsService = inject(OrganizationsService);
  private auth = inject(AuthService);
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);

  childrenAccessor = (node: NavNode) => node.children ?? [];

  hasChild = (_: number, node: NavNode) =>
    !!node.children && node.children.length > 0;

  getRouteWithOrgSlug(route: string[]) {
    return route.map((item) =>
      item === "org_slug" ? this.activeOrganizationSlug() : item,
    );
  }

  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganization = this.organizationsService.activeOrganization;
  organizations = this.organizationsService.organizations;
  organizationsInitialLoad = this.organizationsService.initialLoad;
  isLoggedIn = this.auth.isAuthenticated;
  navOpen = this.mainNav.navOpen;
  billingEnabled = this.settingsService.billingEnabled;
  paidForGlitchTip = this.settingsService.paidForGlitchTip;
  mobileNav = this.mainNav.mobileNav;
  version = this.settingsService.version;

  contextLoaded = computed(
    () =>
      this.settingsService.initialLoad() &&
      this.organizationsInitialLoad() &&
      !!this.userService.user(),
  );

  canCreateOrg = computed(
    () =>
      this.settingsService.enableOrganizationCreation() ||
      this.userService.user() ||
      this.organizationsService.organizationsCount(),
  );

  menuData = computed(() => {
    // The nav tree data source doesn't update properly if the only change
    // is to a node's children, so we hide the entire node until
    // settings is loaded
    if (!this.settingsService.initialLoad()) {
      return MENU_DATA.filter(
        (node) => !node.children?.find((child) => child.requiresBilling),
      );
    }
    const billingEnabled = this.billingEnabled();
    return MENU_DATA.map((node) => {
      if (node.children && !billingEnabled) {
        node.children = node.children.filter((child) => !child.requiresBilling);
      }
      return node;
    });
  });

  async logout() {
    await this.auth.logout();
    window.location.href = "/login";
  }

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }

  closeSideNav() {
    this.mainNav.getClosedNav();
  }

  onOrgSelectChange(
    event: MatSelectChange<string | undefined>,
    component: MatSelect,
  ) {
    if (event.value) {
      this.organizationsService.setActiveOrganizationSlug(event.value);
    } else {
      component.value = this.activeOrganizationSlug();
      this.router.navigate(["organizations", "new"]);
    }
  }

  reload() {
    this.settingsService.reload();
    this.userService.reload();
    this.organizationsService.reload();
  }
}
