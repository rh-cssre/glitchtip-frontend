import { Injectable, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  MemberRole,
  OrganizationErrors,
  OrganizationLoading,
} from "./organizations.interface";
import { TeamsService } from "../teams/teams.service";
import { Team } from "../teams/teams.interfaces";
import { OrganizationsService } from "../organizations.service";
import { client, handleError } from "../../shared/api/api";
import { components } from "../api-schema";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

type Member = components["schemas"]["OrganizationUserSchema"];

interface OrganizationsState {
  organizationMembers: Member[];
  organizationTeams: Team[];
  errors: OrganizationErrors;
  loading: OrganizationLoading;
  /** Has organizations loaded the first time? */
  initialLoad: boolean;
}

const initialState: OrganizationsState = {
  organizationMembers: [],
  organizationTeams: [],
  errors: {
    createOrganization: "",
    addTeamMember: "",
    removeTeamMember: "",
    addOrganizationMember: "",
  },
  loading: {
    addTeamMember: "",
    removeTeamMember: "",
    addOrganizationMember: false,
  },
  initialLoad: false,
};

@Injectable({
  providedIn: "root",
})
export class OrganizationDetailService extends StatefulService<OrganizationsState> {
  private router = inject(Router);
  private organizationsService = inject(OrganizationsService);
  private snackBar = inject(MatSnackBar);
  private teamsService = inject(TeamsService);

  readonly initialLoad = computed(() => this.state().initialLoad);
  readonly organizationMembers = computed(
    () => this.state().organizationMembers,
  );

  readonly orgHasAProject = computed(() => {
    const projects = this.organizationsService.activeOrganizationProjects();
    return !!projects && projects.length > 0;
  });

  readonly projectsCount = computed(() => {
    const projects = this.organizationsService.activeOrganizationProjects();
    if (!projects) {
      return 0;
    }
    return projects.length;
  });
  teamMembers = this.teamsService.teamMembers;

  readonly filteredAddTeamMembers = computed(() => {
    const organizationMembers = this.organizationMembers();
    const teamMembers = this.teamMembers() || [];

    return organizationMembers.filter(
      (orgMembers) =>
        !teamMembers.find(
          (teamMems) => orgMembers.id === teamMems.id.toString(),
        ),
    );
  });

  readonly organizationTeams = computed(() => this.state().organizationTeams);

  readonly selectedOrganizationTeams = computed(() => this.organizationTeams());

  readonly filteredOrganizationTeams = computed(() => {
    const orgTeams = this.organizationTeams();
    const selectedOrgTeams = this.selectedOrganizationTeams();
    return orgTeams === selectedOrgTeams;
  });

  readonly errors = computed(() => this.state().errors);
  readonly loading = computed(() => this.state().loading);

  constructor() {
    super(initialState);
  }

  async updateOrganization(orgName: string) {
    const body = { name: orgName };
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const { data } = await client.PUT(
      "/api/0/organizations/{organization_slug}/",
      {
        params: { path: { organization_slug: orgSlug } },
        body,
      },
    );
    return data;
  }

  /** Delete organization: route to home page */
  deleteOrganization(slug: string) {
    return client
      .DELETE("/api/0/organizations/{organization_slug}/", {
        params: { path: { organization_slug: slug } },
      })
      .then((result) => {
        if (result.response.status === 204) {
          this.organizationsService.organizationsResource.update((orgs) =>
            orgs?.filter((org) => org.slug !== slug),
          );

          const organizations = this.organizationsService.organizations();
          if (organizations.length) {
            this.organizationsService.setActiveOrganizationSlug(
              organizations[0].slug,
            );
          } else {
            this.organizationsService.setActiveOrganizationSlug(null);
          }
          this.router.navigate([""]);
        }
        return result;
      });
  }

  async retrieveOrganizationMembers(orgSlug: string) {
    const result = await client.GET(
      "/api/0/organizations/{organization_slug}/members/",
      {
        params: { path: { organization_slug: orgSlug } },
      },
    );
    if (result.data) {
      this.setActiveOrganizationMembers(result.data!);
    }
    return result;
  }

  /** Invite a user via email to join an organization */
  inviteOrganizationMembers(
    emailInput: string,
    teamsInput: string[],
    roleInput: MemberRole,
  ) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const data = {
      email: emailInput,
      orgRole: roleInput,
      teamRoles: teamsInput.map((teamSlug) => {
        return { teamSlug, role: "" };
      }),
      sendInvite: true,
      reinvite: true,
    };
    client
      .POST("/api/0/organizations/{organization_slug}/members/", {
        params: { path: { organization_slug: orgSlug } },
        body: data,
      })
      .then((result) => {
        if (result.data) {
          this.snackBar.open(
            `An email invite has been sent to ${result.data.email}`,
          );
          this.router.navigate([orgSlug, "settings", "members"]);
        } else {
          if (result.response.status === 403) {
            this.setAddMemberError(
              "Only organization members with a role of manager or owner can invite new members.",
            );
            // } else if (error.detail) {
            //   this.setAddMemberError(error.error?.detail);
          } else {
            this.setAddMemberError(
              "There was an error processing this request.",
            );
          }
        }
      });
  }

  async retrieveOrganizationTeams(orgSlug: string) {
    const { data } = await client.GET(
      "/api/0/organizations/{organization_slug}/teams/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
          },
        },
      },
    );
    if (data) {
      this.setOrganizationTeams(data as any);
    }
  }

  async createTeam(teamSlug: string, orgSlug: string) {
    const result = await client.POST(
      "/api/0/organizations/{organization_slug}/teams/",
      {
        params: { path: { organization_slug: orgSlug } },
        body: { slug: teamSlug },
      },
    );
    if (result.data) {
      this.organizationsService.refreshActiveOrganization();
      this.teamsService.addTeam(result.data as any);
    }
    return result;
  }

  async addTeamMember(member: Member, orgSlug: string, teamSlug: string) {
    const { data } = await client.POST(
      "/api/0/organizations/{organization_slug}/members/{member_id}/teams/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            member_id: parseInt(member.id),
            team_slug: teamSlug,
          },
        },
        body: member as any,
      },
    );
    if (data) {
      this.teamsService.retrieveTeamMembers(orgSlug, data.slug);
      await this.retrieveOrganizationMembers(orgSlug);
      return data;
    }
    return;
  }

  async removeTeamMember(memberId: number, teamSlug: string) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const { data } = await client.DELETE(
      "/api/0/organizations/{organization_slug}/members/{member_id}/teams/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            member_id: memberId,
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.teamsService.removeMember(memberId);
    }
    return data;
  }

  async leaveTeam(teamSlug: string) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    this.setLeaveTeamLoading(teamSlug);
    const { data, error, response } = await client.DELETE(
      "/api/0/organizations/{organization_slug}/members/{member_id}/teams/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            member_id: "me",
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.snackBar.open($localize`You have left ${data.slug}`);
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setLeaveTeamError(errors.detail[0].msg);
      }
    }
  }

  async joinTeam(teamSlug: string) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    this.setJoinTeamLoading(teamSlug);
    const { data, error, response } = await client.POST(
      "/api/0/organizations/{organization_slug}/members/{member_id}/teams/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            member_id: "me",
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.snackBar.open($localize`You joined ${data.slug}`);
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setJoinTeamError(errors.detail[0].msg);
      }
    }
  }

  clearErrorState() {
    this.setInitialErrorState();
  }

  private setInitialErrorState() {
    this.setState({
      errors: initialState.errors,
    });
  }

  private setLeaveTeamLoading(team: string) {
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        removeTeamMember: team,
      },
    });
  }

  private setJoinTeamLoading(team: string) {
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        addTeamMember: team,
      },
    });
  }

  private setAddMemberError(error: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        addOrganizationMember: error,
      },
      loading: {
        ...state.loading,
        addOrganizationMember: false,
      },
    });
  }

  private setLeaveTeamError(error: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        removeTeamMember: error,
      },
      loading: {
        ...state.loading,
        removeTeamMember: "",
      },
    });
  }

  private setJoinTeamError(error: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        addTeamMember: error,
      },
      loading: {
        ...state.loading,
        addTeamMember: "",
      },
    });
  }

  private setActiveOrganizationMembers(members: Member[]) {
    this.setState({
      organizationMembers: members,
    });
  }

  private setOrganizationTeams(teams: Team[]) {
    this.setState({
      organizationTeams: teams,
    });
  }
}
