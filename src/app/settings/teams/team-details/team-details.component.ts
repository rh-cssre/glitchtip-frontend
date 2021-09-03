import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "gt-team-details",
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
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
