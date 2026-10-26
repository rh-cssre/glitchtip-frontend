import { Injectable, computed, inject } from "@angular/core";
import { ProjectsService } from "src/app/projects/projects.service";
import {
  ProjectError,
  ProjectAlerts,
  NotificationStatus,
  GroupedProjects,
} from "./notifications.interface";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { client, handleError } from "src/app/shared/api/api";

interface NotificationsState {
  projectViewExpanded: boolean;
  subscribeByDefault: boolean;
  subscribeByDefaultLoading: boolean;
  subscribeByDefaultError: string;
  projectAlertLoading: number | null;
  projectAlertError: ProjectError | null;
}

const initialState: NotificationsState = {
  projectViewExpanded: false,
  subscribeByDefault: true,
  subscribeByDefaultLoading: false,
  subscribeByDefaultError: "",
  projectAlertLoading: null,
  projectAlertError: null,
};

@Injectable()
export class NotificationsService extends StatefulService<NotificationsState> {
  private projectsService = inject(ProjectsService);

  #notificationsResource = apiResource(() => ({
    url: "/api/0/users/{user_id}/notifications/",
    options: { params: { path: { user_id: "me" } } },
  }));
  #alertsList = apiResource(() => ({
    url: "/api/0/users/{user_id}/notifications/alerts/",
    options: { params: { path: { user_id: "me" } } },
  }));
  readonly subscribeByDefault = computed(
    () => this.#notificationsResource.value()?.subscribeByDefault || false,
  );
  readonly projectViewExpanded = computed(
    () => this.state().projectViewExpanded,
  );
  readonly subscribeByDefaultLoading = computed(
    () => this.state().subscribeByDefaultLoading,
  );
  readonly subscribeByDefaultError = computed(
    () => this.state().subscribeByDefaultError,
  );
  readonly projectAlertLoading = computed(
    () => this.state().projectAlertLoading,
  );
  readonly projectAlertsError = computed(() => this.state().projectAlertError);
  userAlertSettings = computed(() => {
    const projectAlerts = this.#alertsList.value();
    const projects = this.projectsService.projects();
    if (projectAlerts && projects) {
      const projectsWithAlerts = projects.map((project) => {
        const matchingId = Object.keys(projectAlerts).find(
          (element) => element === project.id,
        );
        return {
          ...project,
          alertStatus: matchingId ? projectAlerts[matchingId] : -1,
        };
      });
      return projectsWithAlerts;
    }
    return;
  });
  groupedProjects = computed(() => {
    const projects = this.userAlertSettings();
    if (projects) {
      return projects.reduce((r: GroupedProjects, a: any) => {
        r[+a.organization.id] = [...(r[+a.organization.id] || []), a];
        return r;
      }, {});
    }
    return [];
  });

  constructor() {
    super(initialState);
  }

  subscribeToEndpoints() {
    this.projectsService.retrieveProjects();
  }

  async alertsUpdate(projectId: number, status: NotificationStatus) {
    const body: ProjectAlerts = {
      [projectId]: status,
    };
    this.setProjectAlertLoading(projectId);
    const { error, response } = await client.PUT(
      "/api/0/users/{user_id}/notifications/alerts/",
      {
        params: {
          path: {
            user_id: "me",
          },
        },
        body,
      },
    );
    this.#alertsList.reload();
    this.setProjectAlertLoading(null);
    if (response.status !== 204) {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setProjectAlertError(errors.detail[0].msg, projectId);
      }
    }
  }

  async notificationsUpdate(subscribe: boolean) {
    const body = { subscribeByDefault: subscribe };
    this.setSubscribeByDefaultLoading(true);
    const { data, error, response } = await client.PUT(
      "/api/0/users/{user_id}/notifications/",
      {
        params: {
          path: {
            user_id: "me",
          },
        },
        body,
      },
    );
    this.setSubscribeByDefaultLoading(false);
    if (data) {
      this.setSubscribeByDefault(data.subscribeByDefault);
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setSubscribeByDefaultError(errors.detail[0].msg);
      }
    }
  }

  toggleProjectView() {
    this.setToggleProjectView();
  }

  private setSubscribeByDefault(subscribe: boolean) {
    this.setState({
      ...this.state(),
      subscribeByDefault: subscribe,
    });
  }

  private setToggleProjectView() {
    const projectViewExpanded = this.state().projectViewExpanded;
    this.setState({
      ...this.state(),
      projectViewExpanded: !projectViewExpanded,
    });
  }

  private setSubscribeByDefaultError(error: string) {
    this.setState({
      ...this.state(),
      subscribeByDefaultError: error,
    });
  }

  private setSubscribeByDefaultLoading(loading: boolean) {
    this.setState({
      ...this.state(),
      subscribeByDefaultLoading: loading,
    });
  }

  private setProjectAlertLoading(projectId: number | null) {
    this.setState({
      ...this.state(),
      projectAlertLoading: projectId,
    });
  }

  private setProjectAlertError(error: string, id: number) {
    this.setState({
      ...this.state(),
      projectAlertError: { error, id },
    });
  }
}
