import { Component, OnInit, inject } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { lastValueFrom } from "rxjs";
import { SettingsService } from "./api/settings.service";
import { UserService } from "./api/user/user.service";
import { setTheme } from "./shared/shared.utils";
import { AuthService } from "./auth.service";
import { MatIconRegistry } from "@angular/material/icon";
import { toObservable } from "@angular/core/rxjs-interop";

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

  userDetails$ = toObservable(this.userService.user);

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
    this.userDetails$.subscribe((user) => {
      setTheme(user?.options.preferredTheme || localStorage.getItem("theme"));
    });
    systemTheme.addEventListener("change", () => {
      const s = this.userDetails$.subscribe((user) => {
        setTheme(user?.options.preferredTheme);
      });
      s.unsubscribe();
    });

    lastValueFrom(this.authService.checkServerAuthStatus());
  }
}
