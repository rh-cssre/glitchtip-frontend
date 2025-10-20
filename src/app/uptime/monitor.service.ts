import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MonitorInput, ResponseTimeSeries } from "./uptime.interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { SettingsService } from "../api/settings.service";
import { SubscriptionService } from "../api/subscriptions/subscription.service";
import { ServerError } from "../shared/django.interfaces";
import { OrganizationsService } from "../api/organizations.service";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { client } from "../shared/api/api";
import { components } from "../api/api-schema";

type MonitorCheckSchema = components["schemas"]["MonitorCheckSchema"];
interface MonitorCheck extends MonitorCheckSchema {
  responseTime: number;
}

export interface MonitorState {
  editLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  error: ServerError | null;
}

const initialState: MonitorState = {
  editLoading: false,
  createLoading: false,
  deleteLoading: false,
  error: null,
};

@Injectable({
  providedIn: "root",
})
export class MonitorService extends StatefulService<MonitorState> {
  private organizationsService = inject(OrganizationsService);
  private settingsService = inject(SettingsService);
  private subscriptionService = inject(SubscriptionService);
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
        "/api/0/organizations/{organization_slug}/monitors/{monitor_id}/",
        {
          params: {
            path: {
              organization_slug: params.organizationSlug,
              monitor_id: params.monitorId,
            },
          },
        },
      );
      return data;
    },
  });
  monitorUptimeAlertsResource = resource({
    params: () => ({
      organizationSlug: this.activeOrganizationSlug(),
      projectSlug: this.associatedProjectSlug(),
    }),
    loader: async ({ params }) => {
      if (!params.organizationSlug || !params.projectSlug) {
        return undefined;
      }
      const { data } = await client.GET(
        "/api/0/projects/{organization_slug}/{project_slug}/alerts/",
        {
          params: {
            path: {
              organization_slug: params.organizationSlug,
              project_slug: params.projectSlug,
            },
          },
        },
      );
      return data;
    },
  });

  editLoading = computed(() => this.state().editLoading);
  createLoading = computed(() => this.state().createLoading);
  deleteLoading = computed(() => this.state().deleteLoading);
  error = computed(() => this.state().error);
  uptimeAlertCount = computed(
    () => this.monitorUptimeAlertsResource.value()?.length || 0,
  );
  alertCountLoading = computed(() =>
    this.monitorUptimeAlertsResource.isLoading(),
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
        .POST("/api/0/organizations/{organization_slug}/monitors/", {
          params: { path: { organization_slug: orgSlug } },
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

  callSubscriptionDetails() {
    const billingEnabled = this.settingsService.billingEnabled();
    if (billingEnabled) {
      const slug = this.organizationsService.activeOrganizationSlug();
      if (slug) {
        this.subscriptionService.retrieveSubscriptionData(slug);
      }
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
      .PUT("/api/0/organizations/{organization_slug}/monitors/{monitor_id}/", {
        params: {
          path: {
            organization_slug: organizationSlug,
            monitor_id: monitorId,
          },
        },
        body: data as any,
      })
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

  deleteMonitor() {
    const monitorId = this.activeMonitor()?.id;
    const organizationSlug = this.activeOrganizationSlug();
    if (!monitorId) {
      return;
    }
    this.setDeleteMonitorStart();
    client
      .DELETE(
        "/api/0/organizations/{organization_slug}/monitors/{monitor_id}/",
        {
          params: {
            path: {
              organization_slug: organizationSlug,
              monitor_id: monitorId,
            },
          },
        },
      )
      .then((result) => {
        if (result.response.ok) {
          this.setDeleteMonitorEnd();
          this.snackBar.open("Monitor has been deleted.");
          this.router.navigate([organizationSlug, "uptime-monitors"]);
        } else {
          this.setDeleteMonitorError();
          this.snackBar.open(
            `There was an error deleting this issue. Please try again.`,
          );
        }
      });
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
    });
  }

  private setDeleteMonitorEnd() {
    this.clearState();
  }

  private setDeleteMonitorError() {
    this.setState({
      deleteLoading: false,
    });
  }

  clearState() {
    super.clearState();
    this.monitorId.set(null);
    this.monitorResource.set(undefined);
  }
}
