import { Component, OnInit, effect, inject } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { SettingsService } from "./api/settings.service";
import { UserService } from "./api/user/user.service";
import { setTheme } from "./shared/shared.utils";
import { AuthService } from "./auth.service";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: "gt-root",
  templateUrl: "./app.component.html",
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private settings = inject(SettingsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private matIconRegistry = inject(MatIconRegistry);

  constructor() {
    effect(() =>
      setTheme(
        this.userService.user()?.options.preferredTheme ||
          localStorage.getItem("theme"),
      ),
    );
  }

  ngOnInit() {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const params = this.route.snapshot.firstChild?.params;
        const orgSlug = params ? params["org-slug"] : undefined;
        this.settings.triggerPlausibleReport(orgSlug);
      }
    });

    const systemTheme = matchMedia("(prefers-color-scheme: dark)");
    systemTheme.addEventListener("change", () =>
      setTheme(this.userService.user()?.options.preferredTheme),
    );

    this.authService.checkServerAuthStatus();
  }
}
