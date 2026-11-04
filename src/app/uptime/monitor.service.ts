import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MonitorInput, ResponseTimeSeries } from "./uptime.interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerError } from "../shared/django.interfaces";
import { OrganizationsService } from "../api/organizations.service";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { client } from "../shared/api/api";
import { components } from "../api/api-schema";
import { apiResource } from "../shared/api/api-resource-factory";
import {
  alertsForMonitor,
  monitorEnvironmentName,
} from "./monitor-detail/monitor-alerts";

type MonitorCheckSchema = components["schemas"]["MonitorCheckSchema"];
interface MonitorCheck extends MonitorCheckSchema {
  responseTime: number;
}

export interface MonitorState {
  editLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  deleteError: string;
  error: ServerError | null;
}

const initialState: MonitorState = {
  editLoading: false,
  createLoading: false,
  deleteLoading: false,
  deleteError: "",
  error: null,
};

@Injectable({
  providedIn: "root",
})
export class MonitorService extends StatefulService<MonitorState> {
  private organizationsService = inject(OrganizationsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  monitorId = signal<number | null>(null);
  monitorResource = resource({
    params: () => ({
      organizationSlug: this.activeOrganizationSlug(),
      monitorId: this.monitorId(),
    }),
    loader: async ({ params }) => {
      if (!params.organizationSlug || !params.monitorId) {
        return undefined;
      }
      const { data } = await client.GET(
        "/api/0/organizations/{organization_id_or_slug}/monitors/{monitor_id}/",
        {
          params: {
            path: {
              ...this.organizationsService.orgPath(params.organizationSlug),
              monitor_id: params.monitorId,
            },
          },
        },
      );
      return data;
    },
  });
  monitorUptimeAlertsResource = apiResource(
    computed(() => {
      const orgSlug = this.activeOrganizationSlug();
      const projectSlug = this.associatedProjectSlug();
      return orgSlug && projectSlug ? { orgSlug, projectSlug } : null;
    }),
    (params) => ({
      url: "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/",
      options: {
        params: {
          path: {
            ...this.organizationsService.orgPath(params.orgSlug),
            project_slug: params.projectSlug,
          },
          query: { limit: 200 },
        },
      },
    }),
  );
  // Hidden environments still trigger alerts, so look up all of them.
  #environmentsResource = apiResource.fetchAll(
    computed(() =>
      typeof this.activeMonitor()?.environmentID === "number"
        ? this.activeOrganizationSlug()
        : null,
    ),
    (orgSlug) => ({
      url: "/api/0/organizations/{organization_id_or_slug}/environments/",
      options: {
        params: {
          path: this.organizationsService.orgPath(orgSlug),
          query: { visibility: "all" },
        },
      },
    }),
  );

  editLoading = computed(() => this.state().editLoading);
  createLoading = computed(() => this.state().createLoading);
  deleteLoading = computed(() => this.state().deleteLoading);
  deleteError = computed(() => this.state().deleteError);
  error = computed(() => this.state().error);
  monitorEnvironment = computed(() =>
    monitorEnvironmentName(
      this.activeMonitor()?.environmentID,
      this.#environmentsResource.hasValue()
        ? this.#environmentsResource.value()
        : undefined,
    ),
  );
  /** Project alerts that notify when this monitor goes down. */
  monitorAlerts = computed(() => {
    const alerts = this.monitorUptimeAlertsResource.hasValue()
      ? this.monitorUptimeAlertsResource.value()
      : undefined;
    const environment = this.monitorEnvironment();
    if (!alerts || environment === undefined) return [];
    return alertsForMonitor(alerts, environment);
  });
  uptimeAlertCount = computed(() => this.monitorAlerts().length);
  alertsError = computed(
    () =>
      !!this.monitorUptimeAlertsResource.error() ||
      (this.monitorEnvironment() === undefined &&
        !!this.#environmentsResource.error()),
  );
  alertCountLoading = computed(
    () =>
      !this.alertsError() &&
      (this.monitorUptimeAlertsResource.isLoading() ||
        this.monitorEnvironment() === undefined),
  );
  activeMonitor = computed(() => this.monitorResource.value());

  associatedProjectSlug = computed(() => {
    const projects = this.organizationsService.activeOrganizationProjects();
    const monitor = this.activeMonitor();
    return projects?.find(
      (project) => project.id === monitor?.projectID?.toString(),
    )?.slug;
  });

  activeMonitorRecentChecksSeries = computed(() => {
    const monitor = this.activeMonitor();
    return monitor?.checks.length
      ? this.convertChecksToSeries(monitor.checks as any)
      : null;
  });

  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;

  constructor() {
    super(initialState);
  }

  createMonitor(monitor: MonitorInput) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    if (orgSlug) {
      this.setCreateMonitorStart();
      client
        .POST("/api/0/organizations/{organization_id_or_slug}/monitors/", {
          params: {
            path: this.organizationsService.orgPath(orgSlug),
          },
          body: monitor as any,
        })
        .then((result) => {
          if (result.data) {
            const newMonitor = result.data;
            this.setCreateMonitorEnd();
            this.snackBar.open(`${newMonitor.name} has been created`);
            this.router.navigate([orgSlug, "uptime-monitors", newMonitor.id]);
          } else {
            this.processError(result.error);
          }
        });
    }
  }

  private processError(err: any) {
    if (err.status === 400) {
      this.setMonitorError(err.error);
    } else if (err instanceof HttpErrorResponse) {
      this.setMonitorError({
        non_field_errors: [`${err.statusText}: ${err.status}`],
      });
    } else {
      this.setMonitorError({
        non_field_errors: [`There was an error saving your monitor details.`],
      });
    }
  }

  editMonitor(data: MonitorInput) {
    const monitorId = this.activeMonitor()?.id;
    const organizationSlug = this.activeOrganizationSlug();
    if (!monitorId) {
      return;
    }
    this.setEditMonitorStart();
    client
      .PUT(
        "/api/0/organizations/{organization_id_or_slug}/monitors/{monitor_id}/",
        {
          params: {
            path: {
              ...this.organizationsService.orgPath(organizationSlug),
              monitor_id: monitorId,
            },
          },
          body: data as any,
        },
      )
      .then((result) => {
        if (result.data) {
          const updatedMonitor = result.data;
          this.setEditMonitorEnd();
          this.snackBar.open(`${updatedMonitor.name} has been updated`);
          this.router.navigate([
            organizationSlug,
            "uptime-monitors",
            updatedMonitor.id,
          ]);
        } else {
          this.processError(result.error);
        }
      });
  }

  retrieveMonitorDetails(monitorId: number) {
    this.monitorId.set(monitorId);
  }

  async deleteMonitor(): Promise<boolean> {
    const monitorId = this.activeMonitor()?.id;
    const organizationSlug = this.activeOrganizationSlug();
    if (!monitorId) {
      return false;
    }
    this.setDeleteMonitorStart();
    const result = await client.DELETE(
      "/api/0/organizations/{organization_id_or_slug}/monitors/{monitor_id}/",
      {
        params: {
          path: {
            ...this.organizationsService.orgPath(organizationSlug),
            monitor_id: monitorId,
          },
        },
      },
    );
    if (!result.response.ok) {
      this.setDeleteMonitorError();
      return false;
    }
    this.setDeleteMonitorEnd();
    this.snackBar.open($localize`Monitor has been deleted.`);
    this.router.navigate([organizationSlug, "uptime-monitors"]);
    return true;
  }

  private formatData(check: MonitorCheck) {
    return {
      name: new Date(check.startCheck!),
      value: check.responseTime ?? 0,
    };
  }

  private convertChecksToSeries(input: MonitorCheck[]) {
    return input.reduce(
      (resultArray, check) => {
        const lastEntry = resultArray[resultArray.length - 1];
        if (
          !lastEntry.series.length ||
          (lastEntry.name === "Up" && check.isUp) ||
          (lastEntry.name === "Down" && !check.isUp)
        ) {
          lastEntry.series.push(this.formatData(check));
        } else {
          resultArray.push({
            name: check.isUp ? "Up" : "Down",
            series: [this.formatData(check)],
          });
        }
        return resultArray;
      },
      [
        {
          name: input[0].isUp ? "Up" : "Down",
          series: [],
        },
      ] as ResponseTimeSeries[],
    );
  }

  private setCreateMonitorStart() {
    this.setState({
      createLoading: true,
    });
  }

  private setCreateMonitorEnd() {
    this.setState({
      createLoading: false,
    });
  }

  private setMonitorError(error: ServerError) {
    this.setState({
      createLoading: false,
      editLoading: false,
      error,
    });
  }

  private setEditMonitorStart() {
    this.setState({
      editLoading: true,
    });
  }

  private setEditMonitorEnd() {
    this.setState({
      editLoading: false,
    });
  }

  private setDeleteMonitorStart() {
    this.setState({
      deleteLoading: true,
      deleteError: "",
    });
  }

  private setDeleteMonitorEnd() {
    this.clearState();
  }

  private setDeleteMonitorError() {
    this.setState({
      deleteLoading: false,
      deleteError: $localize`There was an error deleting this monitor. Please try again.`,
    });
  }

  clearState() {
    super.clearState();
    this.monitorId.set(null);
    this.monitorResource.set(undefined);
  }
}
