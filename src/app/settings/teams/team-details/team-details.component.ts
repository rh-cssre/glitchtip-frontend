import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  untracked,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ProjectSettingsService } from "src/app/settings/projects/project-settings.service";

@Component({
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTabsModule,
    RouterLinkActive,
    RouterOutlet,
    PageHeaderComponent,
    BackLinkComponent,
    TopAppBar,
    DatePipe,
  ],
})
export class TeamDetailsComponent {
  orgSlug = input.required<string>({ alias: "org-slug" });
  teamSlug = input.required<string>({ alias: "team-slug" });
  navLinks = [
    {
      path: "members",
      label: $localize`Members`,
    },
    {
      path: "projects",
      label: $localize`Projects`,
    },
    {
      path: "settings",
      label: $localize`Settings`,
    },
  ];

  private teamsService = inject(TeamsService);
  private projectSettingsService = inject(ProjectSettingsService);
  team = this.teamsService.team;
  memberCount = this.teamsService.teamMemberCount;
  tabCounts = computed<Record<string, number | undefined>>(() => ({
    members: this.memberCount(),
    projects: this.projectSettingsService.projectsOnTeamCount(),
  }));

  constructor() {
    // Loads the team and its projects for every tab; Members loads its roster.
    effect(() => {
      const orgSlug = this.orgSlug();
      const teamSlug = this.teamSlug();
      untracked(() => {
        this.teamsService.setTeamKey(orgSlug, teamSlug);
        this.projectSettingsService.retrieveProjectsOnTeam(orgSlug, teamSlug);
      });
    });
  }
}
