interface AlertLike {
  uptime?: boolean | null;
  environments?: string[] | null;
}

/**
 * The project alerts that notify when this monitor goes down. Mirrors the
 * backend's send_monitor_notification query; keep the two in step.
 */
export function alertsForMonitor<T extends AlertLike>(
  alerts: T[],
  environment: string | null,
): T[] {
  return alerts.filter((alert) => {
    if (!alert.uptime) return false;
    const environments = alert.environments ?? [];
    if (!environments.length) return true;
    return !!environment && environments.includes(environment);
  });
}

interface EnvironmentLike {
  id?: number | null;
  name: string;
}

/**
 * The monitor's environment name, which alerts filter on. Undefined while the
 * environments are not loaded (or failed to load), so the list does not
 * briefly show alerts for the wrong environment. Pass hidden environments too.
 */
export function monitorEnvironmentName(
  environmentID: number | null | undefined,
  environments: EnvironmentLike[] | undefined,
): string | null | undefined {
  if (environmentID === null || environmentID === undefined) return null;
  if (!environments) return undefined;
  const match = environments.find(
    (environment) => environment.id === environmentID,
  );
  return match?.name ?? null;
}
