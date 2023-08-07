import { Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { SettingsService } from "./api/settings.service";

@Component({
  selector: "gt-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private settings: SettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.settings.getSettings().subscribe();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const params = this.route.snapshot.firstChild?.params;
        const orgSlug = params ? params["org-slug"] : undefined;
        this.settings.triggerPlausibleReport(orgSlug);
      }
    });
  }
}
