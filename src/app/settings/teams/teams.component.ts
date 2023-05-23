import { Component, OnInit } from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, filter, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { NewTeamComponent } from "./new-team/new-team.component";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgIf, NgFor, AsyncPipe, I18nPluralPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "gt-teams",
    templateUrl: "./teams.component.html",
    styleUrls: ["./teams.component.scss"],
    standalone: true,
    imports: [
        MatButtonModule,
        MatCardModule,
        RouterLink,
        MatDividerModule,
        NgIf,
        MatFormFieldModule,
        NgFor,
        LoadingButtonComponent,
        AsyncPipe,
        I18nPluralPipe,
    ],
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
