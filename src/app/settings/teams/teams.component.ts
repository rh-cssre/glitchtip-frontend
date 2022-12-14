import { Component, OnInit } from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute } from "@angular/router";
import { map, filter, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { NewTeamComponent } from "./new-team/new-team.component";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "gt-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
})
export class TeamsComponent implements OnInit {
  activeOrganization$ = this.organizationsService.activeOrganization$;
  yourTeams$ = this.activeOrganization$.pipe(
    map((orgDetails) => orgDetails?.teams?.filter((team) => team.isMember))
  );
  otherTeams$ = this.activeOrganization$.pipe(
    map((orgDetails) => orgDetails?.teams?.filter((team) => !team.isMember))
  );
  errors$ = this.organizationsService.errors$;
  loading$ = this.organizationsService.loading$;
  orgSlug?: string;

  memberCountPluralMapping: { [k: string]: string } = {
    "=1": "1 Member",
    other: "# Members",
  };

  constructor(
    private teamsService: TeamsService,
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => params["org-slug"] as string),
        filter((slug) => !!slug),
        tap((slug) => (this.orgSlug = slug))
      )
      .subscribe((slug) => {
        this.teamsService.retrieveTeamsByOrg(slug).toPromise();
      });
  }

  openCreateTeamDialog() {
    this.dialog.open(NewTeamComponent, {
      maxWidth: "500px",
      data: {
        orgSlug: this.orgSlug,
      },
    });
  }

  leaveTeam(team: string) {
    this.organizationsService.leaveTeam(team);
  }

  joinTeam(team: string) {
    this.organizationsService.joinTeam(team);
  }
}
