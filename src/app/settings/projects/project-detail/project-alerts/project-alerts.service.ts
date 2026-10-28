import { Injectable, computed, inject, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations.service";
import { components } from "src/app/api/api-schema";
import { client, handleError } from "src/app/shared/api/api";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { ProjectSlugs, sameProjectSlugs } from "../project-slugs";

type AlertRecipient = components["schemas"]["AlertRecipientSchema"];
export type NewAlertRecipient = Omit<AlertRecipient, "id" | "url"> & {
  url: string;
  botEmail?: string;
  apiKey?: string;
  channel?: string;
  topic?: string;
};

function withScheme(url: string | null | undefined) {
  return url && !url.startsWith("http") ? "https://" + url : (url ?? "");
}

/** A saved recipient carries Zulip settings in config; the API takes them flat. */
export function toRecipientInput(
  recipient: AlertRecipient | NewAlertRecipient,
): NewAlertRecipient {
  if ("botEmail" in recipient || recipient.recipientType !== "zulip") {
    const { recipientType, url, botEmail, apiKey, channel, topic } =
      recipient as NewAlertRecipient;
    return {
      recipientType,
      url: withScheme(url),
      botEmail,
      apiKey,
      channel,
      topic,
    };
  }
  const config = (recipient.config ?? {}) as Record<string, string>;
  return {
    recipientType: recipient.recipientType,
    url: withScheme(recipient.url),
    botEmail: config["bot_email"],
    apiKey: config["api_key"],
    channel: config["channel"],
    topic: config["topic"] || "GlitchTip Alerts",
  };
}

@Injectable()
export class ProjectAlertsService {
  private organizationsService = inject(OrganizationsService);
  private snackBar = inject(MatSnackBar);

  #params = signal<ProjectSlugs | null>(null, { equal: sameProjectSlugs });
  #projectAlertsResource = apiResource(this.#params, (params) => ({
    url: "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/",
    options: {
      params: {
        path: {
          ...this.organizationsService.orgPath(params.orgSlug),
          project_slug: params.projectSlug,
        },
        query: {
          limit: 200,
        },
      },
    },
  }));
  readonly initialLoad = computed(
    () =>
      this.#projectAlertsResource.hasValue() ||
      !!this.#projectAlertsResource.error(),
  );
  readonly initialLoadError = computed(() =>
    this.#projectAlertsResource.error(),
  );
  readonly projectAlerts = computed(() => {
    // value() throws while the resource is in its error state.
    if (!this.#projectAlertsResource.hasValue()) return undefined;
    return this.#projectAlertsResource.value()?.map((alert) => {
      return {
        ...alert,
        errorAlert: !alert.timespanMinutes && !alert.quantity ? false : true,
      };
    });
  });

  /**
   * Slugs of the teams on this project, whose members get email alerts.
   * Undefined until the organization (which lists them) has loaded.
   */
  readonly projectTeams = computed(() => {
    const slug = this.#params()?.projectSlug;
    const project = this.organizationsService
      .activeOrganization()
      ?.projects.find((p) => p.slug === slug);
    return project?.teams.map((team) => team.slug);
  });

  setParams(orgSlug: string, projectSlug: string) {
    this.#params.set({ orgSlug, projectSlug });
  }

  #path() {
    const params = this.#params()!;
    return {
      ...this.organizationsService.orgPath(params.orgSlug),
      project_slug: params.projectSlug,
    };
  }

  /**
   * Creates (id null) or replaces an alert in one request: name, conditions,
   * environments and recipients. Returns the error message, or null on success.
   */
  async saveAlert(
    id: number | null,
    alert: {
      name: string;
      timespanMinutes: number | null;
      quantity: number | null;
      uptime: boolean;
      environments: string[];
      alertRecipients: (AlertRecipient | NewAlertRecipient)[];
    },
  ): Promise<string | null> {
    const path = this.#path();
    const body = {
      ...alert,
      alertRecipients: alert.alertRecipients.map(toRecipientInput) as any,
    };
    const { data, error, response } = id
      ? await client.PUT(
          "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/{alert_id}/",
          { params: { path: { ...path, alert_id: id } }, body },
        )
      : await client.POST(
          "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/",
          { params: { path }, body },
        );
    if (data) {
      this.snackBar.open(
        id ? $localize`Alert saved` : $localize`Alert created`,
      );
      this.#projectAlertsResource.reload();
      return null;
    }
    return (
      handleError(error, response).detail[0]?.msg ??
      $localize`The alert couldn't be saved. Try again.`
    );
  }

  /** Returns null once the alert is gone, or the error to show. */
  async deleteProjectAlert(id: number): Promise<string | null> {
    const { error, response } = await client.DELETE(
      "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/{alert_id}/",
      { params: { path: { ...this.#path(), alert_id: id } } },
    );
    if (response.status === 204) {
      this.snackBar.open($localize`Alert deleted`);
      this.#projectAlertsResource.reload();
      return null;
    }
    return (
      (error && handleError(error, response).detail[0]?.msg) ||
      $localize`The alert couldn't be deleted. Try again.`
    );
  }

  async testRecipient(alertId: number, recipientId: number) {
    const { data, error } = await client.POST(
      "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/{alert_id}/test/",
      {
        params: {
          path: { ...this.#path(), alert_id: alertId },
          query: { recipient_id: recipientId },
        },
      },
    );
    if (data) {
      const results = data as {
        recipientType: string;
        status: string;
        message?: string | null;
      }[];
      const result = results[0];
      if (!result) {
        this.snackBar.open($localize`No test was sent`);
      } else if (result.status === "error") {
        this.snackBar.open($localize`Test failed: ${result.message}:message:`);
      } else if (result.status === "sent") {
        this.snackBar.open($localize`Test notification sent successfully`);
      } else if (result.status === "skipped") {
        this.snackBar.open(
          $localize`Email recipients are tested via the alert itself`,
        );
      }
    } else if (error) {
      this.snackBar.open($localize`Failed to send test notification`);
    }
  }
}
