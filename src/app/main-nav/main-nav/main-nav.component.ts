import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
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
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AuthService } from "src/app/auth.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from "@angular/material/select";

interface NavItem {
  name: string;
  icon: string;
  route: string[];
  requiresFeature?: string;
  exactRoute?: boolean;
}

@Component({
  selector: "gt-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
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

  navItems: NavItem[] = [
    {
      name: $localize`Issues`,
      icon: "breaking_news",
      route: ["org_slug", "issues"],
    },
    {
      name: $localize`Uptime Monitors`,
      icon: "share_eta",
      route: ["org_slug", "uptime-monitors"],
      requiresFeature: "uptime",
    },
    {
      name: $localize`Performance`,
      icon: "avg_pace",
      route: ["org_slug", "performance"],
    },
    {
      name: $localize`Logs`,
      icon: "text_snippet",
      route: ["org_slug", "logs"],
      requiresFeature: "logs",
    },
    {
      name: $localize`Projects`,
      icon: "team_dashboard",
      route: ["org_slug", "projects"],
    },
    {
      name: $localize`Releases`,
      icon: "rocket_launch",
      route: ["org_slug", "releases"],
    },
  ];

  orgMenuItems: NavItem[] = [
    {
      name: $localize`General settings`,
      icon: "settings",
      route: ["org_slug", "settings"],
      exactRoute: true,
    },
    {
      name: $localize`Projects`,
      icon: "folder",
      route: ["org_slug", "settings", "projects"],
    },
    {
      name: $localize`Subscription`,
      icon: "payment",
      route: ["org_slug", "settings", "subscription"],
    },
    {
      name: $localize`Teams`,
      icon: "groups",
      route: ["org_slug", "settings", "teams"],
    },
    {
      name: $localize`Members`,
      icon: "people",
      route: ["org_slug", "settings", "members"],
    },
  ];

  profileMenuItems: NavItem[] = [
    {
      name: $localize`Account`,
      icon: "person",
      route: ["/profile"],
      exactRoute: true,
    },
    {
      name: $localize`MFA`,
      icon: "security",
      route: ["/profile", "multi-factor-auth"],
    },
    {
      name: $localize`Notifications`,
      icon: "notifications",
      route: ["/profile", "notifications"],
    },
    {
      name: $localize`Auth Tokens`,
      icon: "vpn_key",
      route: ["/profile", "auth-tokens"],
    },
  ];

  visibleNavItems = computed(() => {
    const enabledFeatures = this.settingsService.enabledFeatures();
    return this.navItems.filter(
      (node) =>
        !node.requiresFeature || enabledFeatures.includes(node.requiresFeature),
    );
  });

  visibleOrgMenuItems = this.orgMenuItems;

  isCollapsed = signal(false);

  getRouteWithOrgSlug(route: string[]) {
    return route.map((item) =>
      item === "org_slug" ? this.activeOrganizationSlug() : item,
    );
  }

  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  activeOrganization = this.organizationsService.activeOrganization;
  organizations = this.organizationsService.organizations;
  organizationsInitialLoad = this.organizationsService.initialLoad;
  isLoggedIn = this.auth.isAuthenticated;
  navOpen = this.mainNav.navOpen;
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

  async logout() {
    await this.auth.logout();
    window.location.href = "/login";
  }

  private dispatchResizeEvent() {
    window.dispatchEvent(new Event("resize"));
  }

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }

  toggleCollapse() {
    this.isCollapsed.update((val) => !val);
    this.dispatchResizeEvent();
  }

  closeSideNav() {
    this.mainNav.getClosedNav();
    if (this.isCollapsed()) {
      this.isCollapsed.set(false);
      this.dispatchResizeEvent();
    }
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
