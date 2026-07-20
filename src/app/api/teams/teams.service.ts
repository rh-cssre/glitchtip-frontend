import { Injectable, computed, inject, signal } from "@angular/core";
import { TeamErrors, TeamLoading } from "./teams.interfaces";
import { UserService } from "../user/user.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client, handleError } from "../../shared/api/api";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { components } from "../api-schema";
type Team = components["schemas"]["TeamProjectSchema"];

interface TeamsState {
  errors: TeamErrors;
  loading: TeamLoading;
}

const initialState: TeamsState = {
  errors: { updateName: "", deleteTeam: "" },
  loading: { updateName: false, deleteTeam: false },
};

interface TeamKey {
  orgSlug: string;
  teamSlug: string;
}

@Injectable({
  providedIn: "root",
})
export class TeamsService extends StatefulService<TeamsState> {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private teamsOrgSlug = signal<string>("");
  teamsResource = apiResource(this.teamsOrgSlug, (slug) => ({
    url: "/api/0/organizations/{organization_slug}/teams/",
    options: { params: { path: { organization_slug: slug } } },
  }));
  readonly teams = computed(() => this.teamsResource.value() ?? null);

  private teamKey = signal<TeamKey | null>(null);
  teamResource = apiResource(this.teamKey, ({ orgSlug, teamSlug }) => ({
    url: "/api/0/teams/{organization_slug}/{team_slug}/",
    options: {
      params: { path: { organization_slug: orgSlug, team_slug: teamSlug } },
    },
  }));
  readonly team = computed(() => this.teamResource.value() ?? null);

  private teamMembersKey = signal<TeamKey | null>(null);
  teamMembersResource = apiResource(
    this.teamMembersKey,
    ({ orgSlug, teamSlug }) => ({
      url: "/api/0/teams/{organization_slug}/{team_slug}/members/",
      options: {
        params: { path: { organization_slug: orgSlug, team_slug: teamSlug } },
      },
    }),
  );
  readonly teamMembers = computed(() => this.teamMembersResource.value() ?? []);
  readonly loading = computed(() => this.state().loading);
  readonly errors = computed(() => this.state().errors);
  readonly userTeamRole = computed(() => {
    const userEmail = this.userService.activeUserEmail();
    const activeTeamMember = this.teamMembers().find(
      (teamMember) => teamMember.email === userEmail,
    );
    return activeTeamMember?.role;
  });

  constructor() {
    super(initialState);
  }

  setTeamsOrgSlug(orgSlug: string) {
    this.teamsOrgSlug.set(orgSlug);
  }

  setTeamKey(orgSlug: string, teamSlug: string) {
    this.teamKey.set(orgSlug && teamSlug ? { orgSlug, teamSlug } : null);
  }

  setTeamMembersKey(orgSlug: string, teamSlug: string) {
    this.teamMembersKey.set(
      orgSlug && teamSlug ? { orgSlug, teamSlug } : null,
    );
  }

  async updateTeamSlug(orgSlug: string, teamSlug: string, newTeamSlug: string) {
    this.setUpdateTeamSlugLoading(true);
    const { data, error, response } = await client.PUT(
      "/api/0/teams/{organization_slug}/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            team_slug: teamSlug,
          },
        },
        body: {
          slug: newTeamSlug,
        },
      },
    );
    if (data) {
      this.router.navigate([
        orgSlug,
        "settings",
        "teams",
        data.slug,
        "settings",
      ]);
      this.setUpdateTeamSlugLoading(false);
      this.snackBar.open(
        $localize`Your team slug has been changed to #${data.slug}`,
      );
      this.teamResource.set(data);
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setUpdateTeamSlugError(errors.detail[0].msg);
      }
    }
  }

  async deleteTeam(orgSlug: string, teamSlug: string) {
    this.setDeleteTeamLoading(true);
    const result = await client.DELETE(
      "/api/0/teams/{organization_slug}/{team_slug}/",
      {
        params: { path: { organization_slug: orgSlug, team_slug: teamSlug } },
      },
    );
    this.setDeleteTeamLoading(false);
    if (result.error) {
      // this.setDeleteTeamError(result.response);
    } else {
      this.snackBar.open(`You have successfully deleted #${teamSlug}`);
      this.router.navigate([orgSlug, "settings", "teams"]);
    }
    return result;
  }

  private setDeleteTeamLoading(loading: boolean) {
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        deleteTeam: loading,
      },
    });
  }

  addTeam(team: Team) {
    const current = this.teamsResource.value() ?? [];
    this.teamsResource.set([team, ...current]);
  }

  removeMember(memberId: number) {
    const current = this.teamMembersResource.value() ?? [];
    this.teamMembersResource.set(
      current.filter((m) => m.id !== memberId.toString()),
    );
  }

  private setUpdateTeamSlugLoading(loading: boolean) {
    const state = this.state();
    this.setState({ loading: { ...state.loading, updateName: loading } });
  }

  private setUpdateTeamSlugError(error: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        updateName: error,
      },
      loading: {
        ...state.loading,
        updateName: false,
      },
    });
  }
}
