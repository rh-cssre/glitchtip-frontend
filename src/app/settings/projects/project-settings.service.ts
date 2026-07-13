import { Injectable, computed, inject, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "src/app/shared/api/api";
import { components } from "src/app/api/api-schema";

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
  projectsOnTeam: ProjectSchema[];
  projectsNotOnTeam: ProjectSchema[];
  projectKeys: ProjectKey[] | null;
  loading: ProjectLoading;
  errors: ProjectError;
}

const initialState: ProjectSettingsState = {
  projectsOnTeam: [],
  projectsNotOnTeam: [],
  projectKeys: null,
  loading: { addProjectToTeam: false, removeProjectFromTeam: "" },
  errors: { addProjectToTeam: "", removeProjectFromTeam: "" },
};

@Injectable({
  providedIn: "root",
})
export class ProjectSettingsService extends StatefulService<ProjectSettingsState> {
  private snackBar = inject(MatSnackBar);

  private params = signal({ orgSlug: "", teamSlug: "" });
  activeProjectSlug = signal("");
  readonly projectsOnTeam = computed(() => this.state().projectsOnTeam);
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
    const { data, error } = await client.POST(
      "/api/0/projects/{organization_slug}/{project_slug}/teams/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            project_slug: projectSlug,
            team_slug: teamSlug,
          },
        },
      },
    );
    if (data) {
      this.snackBar.open(`${data.slug} has been added to #${teamSlug}`);
      this.setAddProjectToTeam(data);
    }
    if (error) {
      this.setAddProjectToTeamError(error);
    }
  }

  async removeProjectFromTeam(
    orgSlug: string,
    teamSlug: string,
    projectSlug: string,
  ) {
    this.setRemoveProjectFromTeamLoading(projectSlug);
    const { data, error } = await client.DELETE(
      "/api/0/projects/{organization_slug}/{project_slug}/teams/{team_slug}/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            project_slug: projectSlug,
            team_slug: teamSlug,
          },
        },
      },
    );

    if (data) {
      this.snackBar.open(`${data.slug} has been removed from #${teamSlug}`);
      this.setRemoveProjectFromTeam(data);
    }
    if (error) {
      this.setRemoveProjectFromTeamLoadingError(error);
    }
  }

  retrieveProjectsOnTeam(orgSlug: string, teamSlug: string) {
    client
      .GET("/api/0/organizations/{organization_slug}/projects/", {
        params: {
          path: {
            organization_slug: orgSlug,
          },
          query: {
            query: `team:${teamSlug}`,
          },
        },
      })
      .then(({ data }) => {
        if (data) {
          this.setProjectsPerTeam(data);
        }
      });
  }

  async retrieveProjectsNotOnTeam(orgSlug: string, teamSlug: string) {
    const { data } = await client.GET(
      "/api/0/organizations/{organization_slug}/projects/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
          },
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
  }

  private setAddProjectToTeamError(error: HttpErrorResponse) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        addProjectToTeam: `${error.statusText}: ${error.status}`,
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
      loading: {
        ...state.loading,
        addProjectToTeam: loading,
      },
    });
  }

  private setRemoveProjectFromTeamLoading(projectSlug: string) {
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        removeProjectFromTeam: projectSlug,
      },
    });
  }

  private setRemoveProjectFromTeamLoadingError(error: HttpErrorResponse) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        removeProjectFromTeam: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        removeProjectFromTeam: "",
      },
    });
  }

  private setProjectsPerTeam(projectsOnTeam: ProjectSchema[]) {
    this.setState({
      projectsOnTeam,
    });
  }

  private setProjectsNotOnTeam(projectsNotOnTeam: ProjectSchema[]) {
    this.setState({
      projectsNotOnTeam,
    });
  }

  private setRemoveProjectFromTeam(project: ProjectSchema) {
    const filteredTeams = this.state().projectsOnTeam.filter(
      (currentProject) => currentProject.slug !== project.slug,
    );
    const notOnTeam = this.state().projectsNotOnTeam?.concat([project]);
    this.setState({
      projectsOnTeam: filteredTeams,
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
    const onTeam = this.state().projectsOnTeam?.concat([project]);
    this.setState({
      projectsOnTeam: onTeam,
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.state().loading,
        addProjectToTeam: false,
      },
    });
  }
}
