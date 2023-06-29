import { Component } from "@angular/core";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { map } from "rxjs/operators";
import { NgFor, AsyncPipe } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "gt-team-details",
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTabsModule,
    NgFor,
    RouterLinkActive,
    RouterOutlet,
    AsyncPipe,
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
