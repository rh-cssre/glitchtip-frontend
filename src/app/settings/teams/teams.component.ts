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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { I18nPluralPipe } from "@angular/common";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

@Component({
  selector: "gt-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
  imports: [
    I18nPluralPipe,
    MatButtonModule,
    MatDialogModule,
    RouterLink,
    MatFormFieldModule,
    LoadingButtonComponent,
    TopAppBar,
    ListComponent,
    ListRowComponent,
    EmptyStateComponent,
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
  loading = this.organizationDetailService.loading;
  accessTeamWrite = this.organizationsService.accessTeamWrite;
  // Mirrors the backend: anyone may join or leave under open membership,
  // managers and owners always, admins only leave teams they are on.
  canJoin = computed(
    () =>
      this.organizationsService.openMembership() ||
      this.organizationsService.accessOrgWrite(),
  );
  canLeave = computed(
    () => this.canJoin() || this.organizationsService.accessTeamAdmin(),
  );

  memberPlural: { [k: string]: string } = {
    "=1": "1 member",
    other: "# members",
  };

  projectPlural: { [k: string]: string } = {
    "=1": "1 project",
    other: "# projects",
  };

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
          title: $localize`Leave #${team}?`,
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
