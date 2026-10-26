interface AlertLike {
  uptime?: boolean | null;
  environments?: string[] | null;
}

/**
 * The project alerts that notify when this monitor goes down.
 *
 * Mirrors the recipient query in the backend's send_monitor_notification
 * (apps/uptime/tasks.py): uptime alerts whose environments are empty or
 * include the monitor's environment; a monitor with no environment only
 * matches alerts with none. Keep the two in step until the backend can return
 * this list itself (see TODO.md).
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
