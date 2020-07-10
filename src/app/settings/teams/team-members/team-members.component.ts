import { Component, OnInit } from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "src/app/api/user/user.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.scss"],
})
export class TeamMembersComponent implements OnInit {
  teamMembers$ = this.teamsService.teamMembers$;
  filteredAddTeamMembers$ = this.organizationsService.filteredAddTeamMembers$;
  userTeamRole$ = this.teamsService.userTeamRole$;

  member = new FormControl();
  orgSlug = "";
  teamSlug = "";
  addMemberError = "";
  removeMemberError = "";
  loading = false;
  selectedTeamMember: number | null = null;

  constructor(
    private teamsService: TeamsService,
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

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
          this.organizationsService
            .retrieveOrganizationMembers(orgSlug)
            .toPromise();
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
          this.loading = false;
          this.snackBar.open(
            `${
              this.member.value.user.name
                ? this.member.value.user.name
                : this.member.value.user.email
            } has been added to #${team.slug}`
          );
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
