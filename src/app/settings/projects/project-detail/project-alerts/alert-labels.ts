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

/** One sentence saying when an alert fires, or null when nothing is picked. */
function triggerSentence(alert: AlertConditions) {
  const quantity = alert.quantity;
  const timespan = alert.timespanMinutes;
  const uptime = !!alert.uptime;
  if (!(quantity && timespan)) {
    return uptime ? $localize`Alerts when an uptime monitor goes down.` : null;
  }
  const events =
    quantity === 1 ? $localize`1 event` : $localize`${quantity} events`;
  const minutes =
    timespan === 1 ? $localize`1 minute` : $localize`${timespan} minutes`;
  return uptime
    ? $localize`Alerts when an issue gets ${events}:events: in ${minutes}:minutes: or an uptime monitor goes down.`
    : $localize`Alerts when an issue gets ${events}:events: in ${minutes}:minutes:.`;
}

function environmentSentence(alert: AlertConditions) {
  if (!alert.environments?.length) return "";
  const envs = new Intl.ListFormat(document.documentElement.lang || undefined, {
    type: "disjunction",
  }).format(alert.environments);
  return " " + $localize`Only in ${envs}:environments:.`;
}

/** One sentence saying when an alert fires, for lists and read-only views. */
export function alertSummary(alert: AlertConditions) {
  return (
    (triggerSentence(alert) ?? $localize`Never alerts: no trigger is set.`) +
    environmentSentence(alert)
  );
}

/** What a draft alert will do, shown above Save so mistakes show up early. */
export function draftSummary(alert: AlertConditions, recipients: number) {
  const when = triggerSentence(alert);
  if (!when) return $localize`Pick at least one trigger above.`;
  const to = !recipients
    ? $localize`Nobody is notified until you add a recipient.`
    : recipients === 1
      ? $localize`Notifies 1 recipient.`
      : $localize`Notifies ${recipients} recipients.`;
  return when + environmentSentence(alert) + " " + to;
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
    return $localize`Zulip: ${channel || recipient.url}`;
  }
  return recipient.url ?? "";
}
