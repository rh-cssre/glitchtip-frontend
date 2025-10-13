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
    updateOrganization: "",
    deleteOrganization: "",
    addTeamMember: "",
    removeTeamMember: "",
    addOrganizationMembers: "",
  },
  loading: {
    updateOrganization: false,
    deleteOrganization: false,
    addTeamMember: "",
    removeTeamMember: "",
    addOrganizationMembers: false,
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
    this.setUpdateOrganizationStart();
    const body = { name: orgName };
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const { data, error, response } = await client.PUT(
      "/api/0/organizations/{organization_slug}/",
      {
        params: { path: { organization_slug: orgSlug } },
        body,
      },
    );
    if (data) {
      this.setUpdateOrganizationComplete();
      this.snackBar.open(
        $localize`The name of your organization has been updated to ${data.name}`,
      );
      return;
    }
    if (response.status === 403) {
      this.setUpdateOrganizationError(
        $localize`Only users with a role of manager or above can update organizations.`,
      );
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setUpdateOrganizationError(errors.detail[0].msg);
      }
    }
  }

  /** Delete organization: route to home page */
  async deleteOrganization(slug: string, name: string) {
    this.setDeleteOrganizationStart();
    const { error, response } = await client.DELETE(
      "/api/0/organizations/{organization_slug}/",
      {
        params: { path: { organization_slug: slug } },
      },
    );

    if (response.status === 204) {
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
      this.setDeleteOrganizationComplete();
      this.snackBar.open(
        `You have successfully deleted ${name} from your organizations`,
      );
      this.router.navigate([""]);
      return;
    }

    if (response.status === 403) {
      this.setDeleteOrganizationError(
        $localize`Only users with a role of manager or above can delete organizations.`,
      );
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setDeleteOrganizationError(errors.detail[0].msg);
      }
    }
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

  /** Invite a list of users via email to join an organization */
  async inviteOrganizationMembers(
    emails: string[],
    teams: string[],
    role: MemberRole,
  ) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    this.setAddOrganizationMembersLoading();
    const results = await Promise.all(
      emails.map(async (email: string) => {
        return await this.inviteOrganizationMember(orgSlug, email, teams, role);
      }),
    );

    if (results.every((result) => result.data)) {
      this.snackBar.open(
        results.length > 1
          ? $localize`Email invites have been sent to the addresses you provided.`
          : $localize`An email invite has been sent to` +
              ` ${results[0].data!.email}`,
      );
      this.setAddOrganizationMembersComplete();
      this.router.navigate([orgSlug, "settings", "members"]);
      return;
    }

    const forbiddenResult = results.find(
      (result) => result.response.status === 403,
    );
    const throttleResult = results.find(
      (result) => result.response.status === 429,
    );
    // Assume all requests were rejected and stay on form page
    if (forbiddenResult) {
      const forbiddenError = forbiddenResult.error as any;
      let forbiddenMessage;
      if (
        forbiddenError &&
        typeof forbiddenError === "object" &&
        "detail" in forbiddenError
      ) {
        forbiddenMessage = forbiddenError.detail;
      }
      this.setAddOrganizationMemberError(
        forbiddenMessage
          ? forbiddenMessage
          : $localize`There was an error. Please try again.`,
      );
      return;
    }
    // If any invitations succeeded, we redirect to org members list
    if (results.find((result) => result.data)) {
      this.snackBar.open(
        throttleResult
          ? $localize`Too many invitations attempted. Not all invitations were sent. Please try again later`
          : $localize`There was an error. Please try again.`,
      );
      this.router.navigate([orgSlug, "settings", "members"]);
      return;
    }

    this.setAddOrganizationMemberError(
      throttleResult
        ? $localize`Too many invitations attempted. Please try again later.`
        : $localize`There was an error. Please try again.`,
    );
  }

  async inviteOrganizationMember(
    orgSlug: string,
    emailInput: string,
    teamsInput: string[],
    roleInput: MemberRole,
  ) {
    const data = {
      email: emailInput,
      orgRole: roleInput,
      teamRoles: teamsInput.map((teamSlug) => {
        return { teamSlug, role: "" };
      }),
      sendInvite: true,
      reinvite: true,
    };
    return await client.POST(
      "/api/0/organizations/{organization_slug}/members/",
      {
        params: { path: { organization_slug: orgSlug } },
        body: data,
      },
    );
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

  resetLoadingState() {
    this.setState({
      loading: initialState.loading,
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

  private setAddOrganizationMembersLoading() {
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        addOrganizationMembers: true,
      },
    });
  }

  private setAddOrganizationMembersComplete() {
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        addOrganizationMembers: false,
      },
    });
  }

  private setAddOrganizationMemberError(error: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        addOrganizationMembers: error,
      },
      loading: {
        ...state.loading,
        addOrganizationMembers: false,
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

  private setDeleteOrganizationStart() {
    const state = this.state();
    this.setState({
      loading: { ...state.loading, deleteOrganization: true },
      errors: {
        ...state.errors,
        deleteOrganization: initialState.errors.deleteOrganization,
      },
    });
  }

  private setDeleteOrganizationError(error: string) {
    const state = this.state();
    this.setState({
      loading: { ...state.loading, deleteOrganization: false },
      errors: { ...state.errors, deleteOrganization: error },
    });
  }

  private setDeleteOrganizationComplete() {
    const state = this.state();
    this.setState({
      loading: { ...state.loading, deleteOrganization: false },
    });
  }

  private setUpdateOrganizationStart() {
    const state = this.state();
    this.setState({
      loading: { ...state.loading, updateOrganization: true },
      errors: {
        ...state.errors,
        updateOrganization: initialState.errors.updateOrganization,
      },
    });
  }

  private setUpdateOrganizationError(error: string) {
    const state = this.state();
    this.setState({
      loading: { ...state.loading, updateOrganization: false },
      errors: { ...state.errors, updateOrganization: error },
    });
  }

  private setUpdateOrganizationComplete() {
    const state = this.state();
    this.setState({
      loading: { ...state.loading, updateOrganization: false },
    });
  }
}
