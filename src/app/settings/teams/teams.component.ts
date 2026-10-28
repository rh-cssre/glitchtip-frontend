import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";
import { TeamsService } from "src/app/api/teams/teams.service";
import { RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NewTeamComponent } from "./new-team/new-team";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  selector: "gt-teams",
  templateUrl: "./teams.component.html",
  imports: [
    MatButtonModule,
    MatDialogModule,
    RouterLink,
    LoadingButtonComponent,
    TopAppBar,
    ListComponent,
    ListRowComponent,
    ListRowLinkComponent,
    EmptyStateComponent,
    PanelComponent,
    SettingsSectionComponent,
    FormErrorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsComponent {
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
  projectCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const project of this.activeOrganization()?.projects ?? []) {
      for (const team of project.teams ?? []) {
        counts[String(team.id)] = (counts[String(team.id)] ?? 0) + 1;
      }
    }
    return counts;
  });
  errors = this.organizationDetailService.errors;
  /** Your teams, then the others; a group with no teams is left out. */
  sections = computed(() =>
    [
      {
        joined: true,
        title: $localize`Your teams`,
        teams: this.yourTeams() ?? [],
        error: this.errors().removeTeamMember,
      },
      {
        joined: false,
        title: $localize`Other teams`,
        teams: this.otherTeams() ?? [],
        error: this.errors().addTeamMember,
      },
    ].filter((section) => section.teams.length),
  );
  loading = this.organizationDetailService.loading;
  canWriteTeam = this.organizationsService.canWriteTeam;
  // Mirrors the backend: open membership lets anyone join or leave; otherwise
  // joining needs Manager+ (org:write) and leaving needs Admin+ (team:write).
  #openMembership = computed(
    () => this.activeOrganization()?.openMembership ?? false,
  );
  canJoinTeam = computed(
    () => this.#openMembership() || this.organizationsService.canWriteOrg(),
  );
  canLeaveTeam = computed(
    () => this.#openMembership() || this.organizationsService.canWriteTeam(),
  );

  /** Every role gets a next step it can take. */
  noTeamsJoinedMessage = computed(() => {
    if (this.canWriteTeam() && this.canJoinTeam()) {
      return $localize`Join a team below, or create a new one.`;
    }
    if (this.canJoinTeam()) {
      return $localize`Join a team below.`;
    }
    if (this.canWriteTeam()) {
      return $localize`Create a team, or ask an organization manager or owner to add you to one.`;
    }
    return $localize`Ask an organization manager or owner to add you to one.`;
  });
  noTeamsMessage = computed(() =>
    this.canWriteTeam()
      ? $localize`Create a team to choose who gets alerts for each project.`
      : $localize`Ask an organization manager or owner to create one.`,
  );

  constructor() {
    effect(() => {
      this.teamsService.setTeamsOrgSlug(this.orgSlug());
    });
  }

  openCreateTeamDialog() {
    this.dialog.open(NewTeamComponent, {
      maxWidth: "500px",
      data: {
        orgSlug: this.orgSlug(),
      },
    });
  }

  projectCount(teamId: string | number) {
    return this.projectCounts()[String(teamId)] ?? 0;
  }

  leaveTeam(team: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Leave #${team}:team:?`,
          message: $localize`You'll stop getting email alerts for this team's projects.`,
          confirmText: $localize`Leave`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.organizationDetailService.leaveTeam(team);
        }
      });
  }

  joinTeam(team: string) {
    this.organizationDetailService.joinTeam(team);
  }
}
