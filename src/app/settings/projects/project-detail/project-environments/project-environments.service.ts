import { Injectable, computed, resource, signal } from "@angular/core";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "src/app/shared/api/api";

interface ProjectsState {
  toggleHiddenLoading: number | null;
}

const initialState: ProjectsState = {
  toggleHiddenLoading: null,
};

@Injectable()
export class ProjectEnvironmentsService extends StatefulService<ProjectsState> {
  #params = signal({ orgSlug: "", projectSlug: "" });

  readonly initialLoad = computed(() => this.environmentsResource.hasValue());
  readonly toggleHiddenLoading = computed(
    () => this.state().toggleHiddenLoading,
  );
  readonly environments = computed(() => this.environmentsResource.value());
  readonly sortedEnvironments = computed(() => {
    const environments = this.environments();
    if (environments === undefined || environments.length === 0) return null;
    const visible = {
      heading: "Visible",
      environments: environments.filter(
        (environment) => environment.isHidden === false,
      ),
    };
    const hidden = {
      heading: "Hidden",
      environments: environments.filter(
        (environment) => environment.isHidden === true,
      ),
    };
    const sorted = [];
    if (visible.environments.length > 0) sorted.push(visible);
    if (hidden.environments.length > 0) sorted.push(hidden);
    return sorted;
  });
  readonly visibleEnvironments = computed(() => {
    return (
      this.environments()
        ?.filter((environment) => environment.isHidden === false)
        .map((environment) => environment.name) || []
    );
  });

  readonly visibleEnvironmentsLoaded = computed(() => {
    if (!this.initialLoad()) return [];
    return this.environments()
      ?.filter((environment) => environment.isHidden === false)
      .map((environment) => environment.name);
  });
  private environmentsResource = resource({
    params: () => ({
      orgSlug: this.#params().orgSlug,
      projectSlug: this.#params().projectSlug,
    }),
    loader: async ({ params }) => {
      if (!params.orgSlug || !params.projectSlug) {
        return undefined;
      }
      const { data } = await client.GET(
        "/api/0/projects/{organization_slug}/{project_slug}/environments/",
        {
          params: {
            path: {
              organization_slug: params.orgSlug,
              project_slug: params.projectSlug,
            },
            query: {
              visibility: "all",
            },
          },
        },
      );
      return data;
    },
  });

  constructor() {
    super(initialState);
  }

  setParams(orgSlug: string, projectSlug: string) {
    this.#params.set({ orgSlug, projectSlug });
  }

  async updateEnvironment(environment: ProjectEnvironment) {
    const params = this.#params();
    if (!params.orgSlug) {
      return;
    }

    this.setState({ toggleHiddenLoading: environment.id });

    const { data } = await client.PUT(
      "/api/0/projects/{organization_slug}/{project_slug}/environments/{name}/",
      {
        params: {
          path: {
            organization_slug: params.orgSlug,
            project_slug: params.projectSlug,
            name: environment.name,
          },
        },
        body: environment,
      },
    );
    if (data) {
      this.environmentsResource.reload();
    }
    this.setState({ toggleHiddenLoading: null });
    return data;
  }

  // Make this computed instead
  // private sortEnvironments(environments: ProjectEnvironment[]) {
  //   // https://stackoverflow.com/a/17387454/
  //   return environments.sort((a, b) =>
  //     a.isHidden === b.isHidden ? 0 : a.isHidden ? 1 : -1,
  //   );
  // }

  // private updatedEnvironments(newEnvironment: ProjectEnvironment) {
  //   const currentEnvironments = this.state().environments;
  //   const environmentToReplace = currentEnvironments.findIndex(
  //     (currentEnvironment) => currentEnvironment.name === newEnvironment.name,
  //   );
  //   currentEnvironments[environmentToReplace] = newEnvironment;
  //   return this.sortEnvironments(currentEnvironments);
  // }
}
