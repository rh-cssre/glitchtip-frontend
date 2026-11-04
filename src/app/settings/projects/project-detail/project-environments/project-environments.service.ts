import { Injectable, computed, inject, signal } from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations.service";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "src/app/shared/api/api";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { ProjectSlugs, sameProjectSlugs } from "../project-slugs";

interface ProjectsState {
  toggleHiddenLoading: number | null;
}

const initialState: ProjectsState = {
  toggleHiddenLoading: null,
};

@Injectable()
export class ProjectEnvironmentsService extends StatefulService<ProjectsState> {
  private organizationsService = inject(OrganizationsService);
  #params = signal<ProjectSlugs | null>(null, { equal: sameProjectSlugs });

  readonly initialLoad = computed(() => this.environmentsResource.hasValue());
  readonly loadError = computed(() => this.environmentsResource.error());
  readonly toggleHiddenLoading = computed(
    () => this.state().toggleHiddenLoading,
  );
  // value() throws while the resource is in its error state.
  readonly environments = computed(() =>
    this.environmentsResource.hasValue()
      ? this.environmentsResource.value()
      : undefined,
  );
  readonly sortedEnvironments = computed(() => {
    const environments = this.environments();
    if (environments === undefined || environments.length === 0) return null;
    const visible = {
      heading: $localize`Visible`,
      environments: environments.filter(
        (environment) => environment.isHidden === false,
      ),
    };
    const hidden = {
      heading: $localize`Hidden`,
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
  private environmentsResource = apiResource(this.#params, (params) => ({
    url: "/api/0/projects/{organization_id_or_slug}/{project_slug}/environments/",
    options: {
      params: {
        path: {
          ...this.organizationsService.orgPath(params.orgSlug),
          project_slug: params.projectSlug,
        },
        query: {
          visibility: "all",
        },
      },
    },
  }));

  constructor() {
    super(initialState);
  }

  setParams(orgSlug: string, projectSlug: string) {
    this.#params.set({ orgSlug, projectSlug });
  }

  async updateEnvironment(environment: ProjectEnvironment) {
    const params = this.#params();
    if (!params) {
      return;
    }

    this.setState({ toggleHiddenLoading: environment.id });

    const { data } = await client.PUT(
      "/api/0/projects/{organization_id_or_slug}/{project_slug}/environments/{name}/",
      {
        params: {
          path: {
            ...this.organizationsService.orgPath(params.orgSlug),
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
