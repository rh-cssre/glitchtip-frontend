import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { Member } from "src/app/api/organizations/organizations.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { OrganizationsService } from "src/app/api/organizations.service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { UserService } from "src/app/api/user/user.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

@Component({
  selector: "gt-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    RouterLink,
    LoadingButtonComponent,
    ListComponent,
    ListRowComponent,
    EmptyStateComponent,
  ],
})
export class TeamMembersComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private organizationsService = inject(OrganizationDetailService);
  route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private orgs = inject(OrganizationsService);

  teamMembers = this.teamsService.teamMembers;
  filteredAddTeamMembers = this.organizationsService.filteredAddTeamMembers;
  canEditMembers = this.teamsService.canModifyTeam;

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
        }),
      )
      .subscribe(({ orgSlug, teamSlug }) => {
        if (orgSlug && teamSlug) {
          this.teamsService.setTeamMembersKey(orgSlug, teamSlug);
          this.organizationsService.setMembersOrgSlug(orgSlug);
        }
      });
    this.userService.getUserDetails();
  }

  async addTeamMember() {
    this.loading = true;
    const team = await this.organizationsService.addTeamMember(
      this.member.value,
      this.orgSlug,
      this.teamSlug,
    );
    this.loading = false;
    if (team) {
      const member: Member = this.member.value;
      this.snackBar.open(
        $localize`${member.email} has been added to #${team.slug}`,
      );
    }
  }

  isMe(email: string) {
    return email === this.userService.activeUserEmail();
  }

  canRemove(email: string) {
    return (
      this.canEditMembers() ||
      (this.isMe(email) && !!this.orgs.activeOrganization()?.openMembership)
    );
  }

  confirmRemoveTeamMember(memberId: string, memberEmail: string) {
    const data = this.isMe(memberEmail)
      ? {
          title: $localize`Leave #${this.teamSlug}?`,
          message: $localize`You'll stop getting email alerts for this team's projects.`,
          confirmText: $localize`Leave`,
        }
      : {
          title: $localize`Remove from #${this.teamSlug}?`,
          message: $localize`${memberEmail} will stop getting email alerts for this team's projects.`,
          confirmText: $localize`Remove`,
        };
    this.dialog
      .open(ConfirmDialogComponent, { data })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.removeTeamMember(memberId, memberEmail);
        }
      });
  }

  async removeTeamMember(memberId: string, memberEmail: string) {
    this.selectedTeamMember = parseInt(memberId);
    const team = await this.organizationsService.removeTeamMember(
      parseInt(memberId),
      this.teamSlug,
    );
    this.selectedTeamMember = null;
    if (team) {
      this.snackBar.open(
        $localize`${memberEmail} has been removed from #${team.slug}`,
      );
    }
  }
}
