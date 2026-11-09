import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { components } from "src/app/api/api-schema";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { UserService } from "src/app/api/user/user.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { roleName } from "src/app/settings/members/member-roles";
import { PanelComponent } from "src/app/shared/panel/panel.component";

type Member = components["schemas"]["OrganizationUserSchema"];

@Component({
  selector: "gt-team-members",
  templateUrl: "./team-members.component.html",
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
    ListRowLinkComponent,
    EmptyStateComponent,
    PanelComponent,
    FormErrorComponent,
    SettingsSectionComponent,
  ],
})
export class TeamMembersComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private organizationsService = inject(OrganizationDetailService);
  route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  teamMembers = this.teamsService.teamMembers;
  membersLoaded = computed(() =>
    this.teamsService.teamMembersResource.hasValue(),
  );
  filteredAddTeamMembers = this.organizationsService.filteredAddTeamMembers;
  canModifyTeam = this.teamsService.canModifyTeam;
  roleName = roleName;
  leaveText = $localize`Leave`;
  removeText = $localize`Remove`;
  noMembersMessage = computed(() =>
    this.canModifyTeam()
      ? $localize`Add organization members to this team so they get alerts for its projects.`
      : $localize`Ask an organization manager or owner to add members to this team.`,
  );

  member = new FormControl<Member | null>(null);
  /** Add stays disabled until something is picked. */
  readonly picked = toSignal(this.member.valueChanges, { initialValue: null });
  orgSlug = "";
  teamSlug = "";
  removeMemberError = signal("");
  addMemberError = signal("");
  loading = signal(false);
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
    const member = this.member.value;
    if (!member) {
      return;
    }
    this.loading.set(true);
    this.addMemberError.set("");
    const { team, error } = await this.organizationsService.addTeamMember(
      member,
      this.orgSlug,
      this.teamSlug,
    );
    this.loading.set(false);
    this.addMemberError.set(error ?? "");
    if (team) {
      this.member.reset();
      this.snackBar.open(
        $localize`${member.email} has been added to #${team.slug}`,
      );
    }
  }

  isMe(email: string) {
    return email === this.userService.activeUserEmail();
  }

  confirmRemoveTeamMember(memberId: string, memberEmail: string) {
    const data = this.isMe(memberEmail)
      ? {
          title: $localize`Leave #${this.teamSlug}:team:?`,
          message: $localize`You'll stop getting email alerts for this team's projects.`,
          confirmText: $localize`Leave`,
        }
      : {
          title: $localize`Remove ${memberEmail}:email: from #${this.teamSlug}:team:?`,
          message: $localize`They'll stop getting email alerts for this team's projects.`,
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
    this.removeMemberError.set("");
    const { team, error } = await this.organizationsService.removeTeamMember(
      parseInt(memberId),
      this.teamSlug,
    );
    this.selectedTeamMember = null;
    this.removeMemberError.set(error ?? "");
    if (team) {
      this.snackBar.open(
        $localize`${memberEmail} has been removed from #${team.slug}`,
      );
    }
  }
}
