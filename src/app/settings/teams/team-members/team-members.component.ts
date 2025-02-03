import { Component, OnInit, inject } from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { Member } from "src/app/api/organizations/organizations.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "src/app/api/user/user.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.scss"],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatDividerModule,
    RouterLink,
    LoadingButtonComponent,
    AsyncPipe,
  ],
})
export class TeamMembersComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private organizationsService = inject(OrganizationDetailService);
  route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);

  teamMembers$ = this.teamsService.teamMembers$;
  filteredAddTeamMembers = this.organizationsService.filteredAddTeamMembers;
  userTeamRole$ = this.teamsService.userTeamRole$;

  member = new FormControl();
  orgSlug = "";
  teamSlug = "";
  addMemberError = "";
  removeMemberError = "";
  loading = false;
  selectedTeamMember: number | null = null;

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => {
          const orgSlug: string = params["org-slug"];
          const teamSlug: string = params["team-slug"];
          this.teamSlug = teamSlug;
          this.orgSlug = orgSlug;
          return { orgSlug, teamSlug };
        })
      )
      .subscribe(({ orgSlug, teamSlug }) => {
        if (orgSlug && teamSlug) {
          this.teamsService.retrieveTeamMembers(orgSlug, teamSlug).toPromise();
          this.organizationsService.retrieveOrganizationMembers(orgSlug);
        }
      });
    this.userService.getUserDetails();
  }

  addTeamMember() {
    this.loading = true;
    this.organizationsService
      .addTeamMember(this.member.value, this.orgSlug, this.teamSlug)
      .subscribe(
        (team) => {
          /** Had some issues with FormControl's value being typed as `any` */
          const member: Member = this.member.value;
          this.loading = false;
          this.snackBar.open(`${member.email} has been added to #${team.slug}`);
        },
        (err) => {
          this.loading = false;
          this.addMemberError = `${err.statusText}: ${err.status}`;
        }
      );
  }

  removeTeamMember(memberId: number, memberEmail: string) {
    this.selectedTeamMember = memberId;
    this.organizationsService
      .removeTeamMember(memberId, this.teamSlug)
      .subscribe(
        (resp) => {
          this.selectedTeamMember = null;
          this.snackBar.open(
            `${memberEmail} has been removed from #${resp.slug}`
          );
        },
        (err) => {
          this.selectedTeamMember = null;
          this.removeMemberError = `${err.statusText}: ${err.status}`;
        }
      );
  }
}
