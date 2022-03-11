import { DownReason } from "./uptime.interfaces";

export function timedeltaToSeconds(interval: string) {
    let seconds = 0;
    if (interval.includes(" ")) {
      seconds += parseInt(interval.split(" ")[0], 10) * 86400;
      interval = interval.split(" ")[1];
    }
    const splitInterval = interval.split(":");
    seconds += parseInt(splitInterval[0], 10) * 3600;
    seconds += parseInt(splitInterval[1], 10) * 60;
    seconds += parseInt(splitInterval[2], 10);

    return seconds;
  }

export const reasonTextConversions = {
  [DownReason.UNKNOWN]: "Unknown",
  [DownReason.TIMEOUT]: "Timeout",
  [DownReason.STATUS]: "Wrong status code",
  [DownReason.BODY]: "Expected response not found",
  [DownReason.SSL]: "SSL error",
  [DownReason.NETWORK]: "Network error",
};