import {
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { TeamErrors, TeamLoading } from "./teams.interfaces";
import { UserService } from "../user/user.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "../organizations.service";
import { apiErrorMessage, client, handleError } from "../../shared/api/api";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { components } from "../api-schema";
type Team = components["schemas"]["TeamProjectSchema"];

interface TeamsState {
  errors: Omit<TeamErrors, "deleteTeam">;
  loading: TeamLoading;
}

const initialState: TeamsState = {
  errors: { updateName: "" },
  loading: { updateName: false, deleteTeam: false },
};

export interface TeamKey {
  orgSlug: string;
  teamSlug: string;
}

// Setting the same team again must not refetch.
export const sameTeamKey = (a: TeamKey | null, b: TeamKey | null) =>
  a?.orgSlug === b?.orgSlug && a?.teamSlug === b?.teamSlug;

@Injectable({
  providedIn: "root",
})
export class TeamsService extends StatefulService<TeamsState> {
  private organizationsService = inject(OrganizationsService);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private teamsOrgSlug = signal<string>("");
  teamsResource = apiResource(this.teamsOrgSlug, (slug) => ({
    url: "/api/0/organizations/{organization_id_or_slug}/teams/",
    options: {
      params: {
        path: this.organizationsService.orgPath(slug),
      },
    },
  }));
  readonly teams = computed(() => this.teamsResource.value() ?? null);

  private teamKey = signal<TeamKey | null>(null, { equal: sameTeamKey });
  teamResource = apiResource(this.teamKey, ({ orgSlug, teamSlug }) => ({
    url: "/api/0/teams/{organization_id_or_slug}/{team_slug}/",
    options: {
      params: {
        path: {
          ...this.organizationsService.orgPath(orgSlug),
          team_slug: teamSlug,
        },
      },
    },
  }));
  // value() throws on a failed load (e.g. an unknown team).
  readonly team = computed(
    () => (this.teamResource.hasValue() && this.teamResource.value()) || null,
  );

  private teamMembersKey = signal<TeamKey | null>(null, {
    equal: sameTeamKey,
  });
  teamMembersResource = apiResource(
    this.teamMembersKey,
    ({ orgSlug, teamSlug }) => ({
      url: "/api/0/teams/{organization_id_or_slug}/{team_slug}/members/",
      options: {
        params: {
          path: {
            ...this.organizationsService.orgPath(orgSlug),
            team_slug: teamSlug,
          },
        },
      },
    }),
  );
  readonly teamMembers = computed(
    () =>
      (this.teamMembersResource.hasValue() &&
        this.teamMembersResource.value()) ||
      [],
  );
  /** The loaded roster's size when it is this team's, else the team's count. */
  readonly teamMemberCount = computed(() =>
    this.teamMembersResource.hasValue() &&
    sameTeamKey(this.teamMembersKey(), this.teamKey())
      ? this.teamMembers().length
      : this.team()?.memberCount,
  );
  readonly loading = computed(() => this.state().loading);
  // A failed delete belongs to the team it was tried on.
  private deleteTeamError = linkedSignal({
    source: this.teamKey,
    computation: () => "",
  });
  readonly errors = computed<TeamErrors>(() => ({
    ...this.state().errors,
    deleteTeam: this.deleteTeamError(),
  }));
  /**
   * Add/remove others on the team whose members are loaded. Mirrors the
   * backend: Admin+ (team:write) if you're on the team, Manager+ (org:write)
   * if you aren't, which is also the answer while the roster loads.
   */
  readonly canModifyTeam = computed(() => {
    const userEmail = this.userService.activeUserEmail();
    return this.teamMembers().some((member) => member.email === userEmail)
      ? this.organizationsService.canWriteTeam()
      : this.organizationsService.canWriteOrg();
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
    this.setUpdateTeamSlugError("");
    this.setUpdateTeamSlugLoading(true);
    const { data, error, response } = await client.PUT(
      "/api/0/teams/{organization_id_or_slug}/{team_slug}/",
      {
        params: {
          path: {
            ...this.organizationsService.orgPath(orgSlug),
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
    this.deleteTeamError.set("");
    this.setDeleteTeamLoading(true);
    const result = await client.DELETE(
      "/api/0/teams/{organization_id_or_slug}/{team_slug}/",
      {
        params: {
          path: {
            ...this.organizationsService.orgPath(orgSlug),
            team_slug: teamSlug,
          },
        },
      },
    );
    this.setDeleteTeamLoading(false);
    if (result.response.ok) {
      this.snackBar.open($localize`You have successfully deleted #${teamSlug}:teamSlug:`);
      this.router.navigate([orgSlug, "settings", "teams"]);
    } else {
      // The schema lists no error body, so the error is typed never.
      const { error } = result as { error?: unknown };
      this.deleteTeamError.set(
        apiErrorMessage(
          error,
          result.response,
          $localize`Could not delete the team.`,
        ),
      );
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
