import { Injectable, computed, inject } from "@angular/core";
import { TeamErrors, TeamLoading } from "./teams.interfaces";
import { UserService } from "../user/user.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client, handleError } from "../../shared/api/api";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { components } from "../api-schema";
type Team = components["schemas"]["TeamProjectSchema"];
type Member = components["schemas"]["OrganizationUserSchema"];

interface TeamsState {
  teams: Team[] | null;
  team: Team | null;
  teamMembers: Member[];
  errors: TeamErrors;
  loading: TeamLoading;
}

const initialState: TeamsState = {
  teams: null,
  team: null,
  teamMembers: [],
  errors: { updateName: "", deleteTeam: "" },
  loading: { updateName: false, deleteTeam: false },
};

@Injectable({
  providedIn: "root",
})
export class TeamsService extends StatefulService<TeamsState> {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly teams = computed(() => this.state().teams);
  readonly team = computed(() => this.state().team);
  readonly teamMembers = computed(() => this.state().teamMembers);
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

  async retrieveTeamsByOrg(orgSlug: string) {
    const { data } = await client.GET(
      "/api/0/organizations/{organization_slug}/teams/",
      {
        params: { path: { organization_slug: orgSlug } },
      },
    );
    if (data) {
      this.setTeams(data as any);
    }
  }

  async retrieveSingleTeam(orgSlug: string, teamSlug: string) {
    const { data } = await client.GET(
      "/api/0/teams/{organization_slug}/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.setSingleTeam(data);
    }
  }

  async retrieveTeamMembers(orgSlug: string, teamSlug: string) {
    const { data } = await client.GET(
      "/api/0/teams/{organization_slug}/{team_slug}/members/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.setTeamMembers(data);
    }
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
      this.setSingleTeam(data);
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
    this.addOneTeam(team);
  }

  removeMember(memberId: number) {
    this.removeTeamMember(memberId);
  }

  private setTeams(teams: Team[]) {
    this.setState({ teams });
  }

  private setSingleTeam(team: Team) {
    this.setState({ team });
  }

  private setTeamMembers(teamMembers: Member[]) {
    this.setState({ teamMembers });
  }

  private removeTeamMember(memberId: number) {
    const filteredMembers = this.state().teamMembers.filter(
      (teamMember) => teamMember.id !== memberId.toString(),
    );
    if (filteredMembers) {
      this.setState({ teamMembers: filteredMembers });
    }
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

  /**
   * Add new team to state
   * The new team needs to be added to the beginning of the Teams array
   */
  private addOneTeam(team: Team) {
    const getTeamsState = this.state().teams;
    const teams = getTeamsState ? getTeamsState : [];

    const newTeams = [team].concat(teams);
    if (newTeams) {
      this.setState({ teams: newTeams });
    }
  }
}
