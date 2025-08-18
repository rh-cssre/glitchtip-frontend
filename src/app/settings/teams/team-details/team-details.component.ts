import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

@Component({
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTabsModule,
    RouterLinkActive,
    RouterOutlet,
    DetailHeaderComponent,
  ],
})
export class TeamDetailsComponent {
  orgSlug = input.required<string>({ alias: "org-slug" });
  teamSlug = input.required<string>({ alias: "team-slug" });
  navLinks = [
    {
      path: "members",
      label: "Members",
    },
    {
      path: "projects",
      label: "Projects",
    },
    {
      path: "settings",
      label: "Settings",
    },
  ];
}
