import { Component } from "@angular/core";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { map } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

@Component({
  selector: "gt-team-details",
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
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
  teamSlug$ = this.route.paramMap.pipe(
    map((params) => params.get("team-slug"))
  );
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
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
  constructor(private route: ActivatedRoute) {}
}
