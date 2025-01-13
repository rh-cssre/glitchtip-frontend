import { Component, OnInit, inject } from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, filter, tap } from "rxjs/operators";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NewTeamComponent } from "./new-team/new-team.component";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    RouterLink,
    MatDividerModule,
    MatFormFieldModule,
    LoadingButtonComponent,
  ],
})
export class TeamsComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  activeOrganization$ = this.organizationsService.activeOrganization$;
  yourTeams$ = this.activeOrganization$.pipe(
    map((orgDetails) => orgDetails?.teams?.filter((team) => team.isMember))
  );
  otherTeams$ = this.activeOrganization$.pipe(
    map((orgDetails) => orgDetails?.teams?.filter((team) => !team.isMember))
  );
  errors$ = this.organizationDetailService.errors$;
  loading$ = this.organizationDetailService.loading$;
  orgSlug?: string;

  memberCountPluralMapping: { [k: string]: string } = {
    "=1": "1 Member",
    other: "# Members",
  };

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
    this.organizationDetailService.leaveTeam(team);
  }

  joinTeam(team: string) {
    this.organizationDetailService.joinTeam(team);
  }
}
