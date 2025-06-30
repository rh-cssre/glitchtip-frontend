import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
} from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NewTeamComponent } from "./new-team/new-team";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { I18nPluralPipe } from "@angular/common";

@Component({
  selector: "gt-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
  imports: [
    I18nPluralPipe,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    RouterLink,
    MatDividerModule,
    MatFormFieldModule,
    LoadingButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  dialog = inject(MatDialog);

  orgSlug = input.required<string>({ alias: "org-slug" });
  activeOrganization = this.organizationsService.activeOrganization;
  yourTeams = computed(() =>
    this.activeOrganization()?.teams.filter((team) => team.isMember),
  );
  otherTeams = computed(() =>
    this.activeOrganization()?.teams.filter((team) => !team.isMember),
  );
  errors = this.organizationDetailService.errors;
  loading = this.organizationDetailService.loading;

  memberCountPluralMapping: { [k: string]: string } = {
    "=1": "1 Member",
    other: "# Members",
  };

  ngOnInit() {
    this.teamsService.retrieveTeamsByOrg(this.orgSlug());
  }

  openCreateTeamDialog() {
    this.dialog.open(NewTeamComponent, {
      maxWidth: "500px",
      data: {
        orgSlug: this.orgSlug(),
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
