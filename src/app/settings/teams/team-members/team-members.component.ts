import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "app-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamMembersComponent implements OnInit {
  teamMembers$ = this.teamsService.teamMembers$;
  orgSlug: string;
  teamSlug: string;

  constructor(
    private teamsService: TeamsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => {
          const orgSlug: string | undefined = params["org-slug"];
          const teamSlug: string | undefined = params["team-slug"];
          return { orgSlug, teamSlug };
        })
      )
      .subscribe(({ orgSlug, teamSlug }) => {
        if (orgSlug && teamSlug) {
          this.teamsService.retrieveTeamMembers(orgSlug, teamSlug).toPromise();
        }
      });
  }
}
