import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/internal/operators/map";

@Component({
  selector: "app-team-details",
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
})
export class TeamDetailsComponent implements OnInit {
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
  ];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
