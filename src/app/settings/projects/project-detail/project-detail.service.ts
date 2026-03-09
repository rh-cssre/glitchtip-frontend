import { computed, Injectable, signal } from "@angular/core";
import { client, handleError } from "src/app/shared/api/api";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

interface State {
  deleteLoading: boolean;
  deleteError: string;
  updateNameLoading: boolean;
  updateNameError: string;
  updatePlatformLoading: boolean;
  updatePlatformError: string;
}

const initialState: State = {
  deleteLoading: false,
  deleteError: "",
  updateNameLoading: false,
  updateNameError: "",
  updatePlatformLoading: false,
  updatePlatformError: "",
};

@Injectable()
export class ProjectDetailService extends StatefulService<State> {
  #params = signal({ orgSlug: "", projectSlug: "" });
  #projectKeysResource = apiResource(this.#params, (params) => ({
    url: "/api/0/projects/{organization_slug}/{project_slug}/keys/",
    options: {
      params: {
        path: {
          organization_slug: params.orgSlug,
          project_slug: params.projectSlug,
        },
        query: {
          limit: 200,
        },
      },
    },
  }));
  #projectResource = apiResource(this.#params, (params) => ({
    url: "/api/0/projects/{organization_slug}/{project_slug}/",
    options: {
      params: {
        path: {
          organization_slug: params.orgSlug,
          project_slug: params.projectSlug,
        },
      },
    },
  }));
  readonly projectKeys = computed(() => this.#projectKeysResource.value());
  readonly project = computed(() => this.#projectResource.value());
  readonly deleteLoading = computed(() => this.state().deleteLoading);
  readonly deleteError = computed(() => this.state().deleteError);
  readonly updateNameLoading = computed(() => this.state().updateNameLoading);
  readonly updateNameError = computed(() => this.state().updateNameError);
  readonly updatePlatformLoading = computed(
    () => this.state().updatePlatformLoading,
  );
  readonly updatePlatformError = computed(
    () => this.state().updatePlatformError,
  );

  constructor() {
    super(initialState);
  }

  setParams(orgSlug: string, projectSlug: string) {
    this.#params.set({ orgSlug, projectSlug });
  }

  async updateProjectName(projectName: string) {
    this.setState({ updateNameLoading: true });
    const { data, error, response } = await client.PUT(
      "/api/0/projects/{organization_slug}/{project_slug}/",
      {
        params: {
          path: {
            organization_slug: this.#params().orgSlug,
            project_slug: this.#params().projectSlug,
          },
        },
        body: { name: projectName },
      },
    );
    if (data) {
      this.clearState();
      this.#projectResource.set(data);
    } else if (error) {
      const err = handleError(error, response);
      const errorMsg: string = err.detail[0].msg
        ? err.detail[0].msg
        : err.detail[0];
      this.setState({
        updateNameLoading: false,
        updateNameError: errorMsg,
      });
    }
    return data;
  }

  async updateProjectPlatform(projectPlatform: string, projectName: string) {
    this.setState({ updatePlatformLoading: true });
    const { data, error } = await client.PUT(
      "/api/0/projects/{organization_slug}/{project_slug}/",
      {
        params: {
          path: {
            organization_slug: this.#params().orgSlug,
            project_slug: this.#params().projectSlug,
          },
        },
        body: { name: projectName, platform: projectPlatform },
      },
    );
    if (data) {
      this.clearState();
      this.#projectResource.set(data);
    } else if (error) {
      this.setState({
        updatePlatformLoading: false,
        updatePlatformError: error,
      });
    }
    return data;
  }

  async deleteProject(): Promise<boolean> {
    this.setState({ deleteLoading: true });
    const { error, response } = await client.DELETE(
      "/api/0/projects/{organization_slug}/{project_slug}/",
      {
        params: {
          path: {
            organization_slug: this.#params().orgSlug,
            project_slug: this.#params().projectSlug,
          },
        },
      },
    );
    if (error) {
      const err = handleError(error, response);
      const errorMsg: string = err.detail[0].msg
        ? err.detail[0].msg
        : err.detail[0];
      this.setState({
        deleteLoading: false,
        deleteError: errorMsg,
      });
      return false;
    }
    this.clearState();
    this.#projectResource.destroy();
    this.#projectKeysResource.destroy();
    return true;
  }
}
