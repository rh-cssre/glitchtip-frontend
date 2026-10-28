import { components } from "src/app/api/api-schema";
import { RecipientType } from "src/app/api/projects/project-alerts/project-alerts.interface";

type ProjectAlert = components["schemas"]["ProjectAlertSchema"];

interface RecipientLike {
  recipientType: string;
  url?: string | null;
  config?: Record<string, unknown> | null;
  channel?: string;
}

export const iconXrefMapping: Partial<Record<RecipientType, string>> = {
  feishu: "webhook",
  teams: "microsoft",
};

export function resolveRecipientIcon(type: string): string {
  return iconXrefMapping[type as RecipientType] ?? type;
}

/** The alert's name, or one built from what it watches, so it stays stable. */
export function alertName(alert: ProjectAlert) {
  if (alert.name) return alert.name;
  const events = !!(alert.quantity && alert.timespanMinutes);
  if (events && alert.uptime) return $localize`Event and uptime alert`;
  return alert.uptime ? $localize`Uptime alert` : $localize`Event alert`;
}

/** The trigger settings a summary needs, from a saved alert or a draft. */
export interface AlertConditions {
  quantity?: number | null;
  timespanMinutes?: number | null;
  uptime?: boolean | null;
  environments?: string[] | null;
}

/**
 * Teams decide who gets email alerts. Pass the project's team slugs when they
 * are known; undefined falls back to a generic label.
 */
export function recipientLabel(recipient: RecipientLike, teams?: string[]) {
  if (recipient.recipientType === "email") {
    if (!teams) return $localize`Email the members of this project's teams.`;
    if (!teams.length) {
      return $localize`Email team members. This project has no teams, so nobody gets these emails.`;
    }
    const names = teams.map((slug) => "#" + slug).join(", ");
    return $localize`Email the members of ${names}:teams:.`;
  }
  if (recipient.recipientType === "zulip") {
    const channel = recipient.channel || recipient.config?.["channel"];
    return $localize`Zulip: ${channel || recipient.url}:destination:`;
  }
  return recipient.url ?? "";
}
