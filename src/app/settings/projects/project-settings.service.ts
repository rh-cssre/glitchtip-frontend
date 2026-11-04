import {
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { apiErrorMessage, client } from "src/app/shared/api/api";
import { components } from "src/app/api/api-schema";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { TeamKey, sameTeamKey } from "src/app/api/teams/teams.service";

type ProjectKey = components["schemas"]["ProjectKeySchema"];
type ProjectSchema = components["schemas"]["ProjectSchema"];

interface ProjectLoading {
  addProjectToTeam: boolean;
  removeProjectFromTeam: string;
}

interface ProjectError {
  addProjectToTeam: string;
  removeProjectFromTeam: string;
}

interface ProjectSettingsState {
  projectsNotOnTeam: ProjectSchema[];
  projectKeys: ProjectKey[] | null;
  loading: ProjectLoading;
  errors: ProjectError;
}

const initialState: ProjectSettingsState = {
  projectsNotOnTeam: [],
  projectKeys: null,
  loading: { addProjectToTeam: false, removeProjectFromTeam: "" },
  errors: { addProjectToTeam: "", removeProjectFromTeam: "" },
};

@Injectable({
  providedIn: "root",
})
export class ProjectSettingsService extends StatefulService<ProjectSettingsState> {
  private organizationsService = inject(OrganizationsService);
  private snackBar = inject(MatSnackBar);

  private params = signal({ orgSlug: "", teamSlug: "" });
  activeProjectSlug = signal("");
  private projectsOnTeamKey = signal<TeamKey | null>(null, {
    equal: sameTeamKey,
  });
  private projectsOnTeamResource = apiResource(
    this.projectsOnTeamKey,
    ({ orgSlug, teamSlug }) => ({
      url: "/api/0/organizations/{organization_id_or_slug}/projects/",
      options: {
        params: {
          path: this.organizationsService.orgPath(orgSlug),
          query: { query: `team:${teamSlug}` },
        },
      },
    }),
  );
  /** Undefined until the team's projects load; add and remove edit it in place. */
  private loadedProjectsOnTeam = linkedSignal<ProjectSchema[] | undefined>(
    () =>
      this.projectsOnTeamResource.hasValue()
        ? this.projectsOnTeamResource.value()
        : undefined,
  );
  readonly projectsOnTeam = computed(() => this.loadedProjectsOnTeam() ?? []);
  readonly projectsOnTeamCount = computed(
    () => this.loadedProjectsOnTeam()?.length,
  );
  readonly projectsNotOnTeam = computed(() => this.state().projectsNotOnTeam);
  readonly addRemoveLoading = computed(() => this.state().loading);
  readonly errors = computed(() => this.state().errors);

  constructor() {
    super(initialState);
  }

  async addProjectToTeam(
    orgSlug: string,
    teamSlug: string,
    projectSlug: string,
  ) {
    this.setAddProjectToTeamLoading(true);
    const { data, error, response } = await client.POST(
      "/api/0/projects/{organization_id_or_slug}/{project_slug}/teams/{team_slug}/",
      {
        params: {
          path: {
            ...this.organizationsService.orgPath(orgSlug),
            project_slug: projectSlug,
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.snackBar.open(`${data.slug} has been added to #${teamSlug}`);
      this.setAddProjectToTeam(data);
      this.organizationsService.refreshActiveOrganization();
    }
    if (error) {
      this.setAddProjectToTeamError(
        apiErrorMessage(error, response, $localize`Could not add the project.`),
      );
    }
  }

  async removeProjectFromTeam(
    orgSlug: string,
    teamSlug: string,
    projectSlug: string,
  ) {
    this.setRemoveProjectFromTeamLoading(projectSlug);
    const { data, error, response } = await client.DELETE(
      "/api/0/projects/{organization_id_or_slug}/{project_slug}/teams/{team_slug}/",
      {
        params: {
          path: {
            ...this.organizationsService.orgPath(orgSlug),
            project_slug: projectSlug,
            team_slug: teamSlug,
          },
        },
      },
    );

    if (data) {
      this.snackBar.open(`${data.slug} has been removed from #${teamSlug}`);
      this.setRemoveProjectFromTeam(data);
      this.organizationsService.refreshActiveOrganization();
    }
    if (error) {
      this.setRemoveProjectFromTeamLoadingError(
        apiErrorMessage(
          error,
          response,
          $localize`Could not remove the project.`,
        ),
      );
    }
  }

  setProjectsOnTeamKey(orgSlug: string, teamSlug: string) {
    this.projectsOnTeamKey.set(
      orgSlug && teamSlug ? { orgSlug, teamSlug } : null,
    );
  }

  async retrieveProjectsNotOnTeam(orgSlug: string, teamSlug: string) {
    const { data } = await client.GET(
      "/api/0/organizations/{organization_id_or_slug}/projects/",
      {
        params: {
          path: this.organizationsService.orgPath(orgSlug),
          query: {
            query: `!team:${teamSlug}`,
          },
        },
      },
    );
    if (data) {
      this.setProjectsNotOnTeam(data);
    }
  }

  setParams(orgSlug: string, teamSlug: string) {
    this.params.set({ orgSlug, teamSlug });
    this.setState({ errors: initialState.errors });
  }

  private setAddProjectToTeamError(message: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        addProjectToTeam: message,
      },
      loading: {
        ...state.loading,
        addProjectToTeam: false,
      },
    });
  }

  private setAddProjectToTeamLoading(loading: boolean) {
    const state = this.state();
    this.setState({
      errors: { ...state.errors, addProjectToTeam: "" },
      loading: {
        ...state.loading,
        addProjectToTeam: loading,
      },
    });
  }

  private setRemoveProjectFromTeamLoading(projectSlug: string) {
    const state = this.state();
    this.setState({
      errors: { ...state.errors, removeProjectFromTeam: "" },
      loading: {
        ...state.loading,
        removeProjectFromTeam: projectSlug,
      },
    });
  }

  private setRemoveProjectFromTeamLoadingError(message: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        removeProjectFromTeam: message,
      },
      loading: {
        ...state.loading,
        removeProjectFromTeam: "",
      },
    });
  }

  private setProjectsNotOnTeam(projectsNotOnTeam: ProjectSchema[]) {
    this.setState({
      projectsNotOnTeam,
    });
  }

  private setRemoveProjectFromTeam(project: ProjectSchema) {
    const filteredTeams = this.projectsOnTeam().filter(
      (currentProject) => currentProject.slug !== project.slug,
    );
    const notOnTeam = this.state().projectsNotOnTeam?.concat([project]);
    this.loadedProjectsOnTeam.set(filteredTeams);
    this.setState({
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.state().loading,
        removeProjectFromTeam: "",
      },
    });
  }

  private setAddProjectToTeam(project: ProjectSchema) {
    const notOnTeam = this.state().projectsNotOnTeam.filter(
      (currentProject) => currentProject.slug !== project.slug,
    );
    this.loadedProjectsOnTeam.set(this.projectsOnTeam().concat([project]));
    this.setState({
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.state().loading,
        addProjectToTeam: false,
      },
    });
  }
}
