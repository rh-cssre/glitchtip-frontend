import { DownReason } from "./uptime.interfaces";

export const reasonTextConversions = {
  [DownReason.UNKNOWN]: "Unknown",
  [DownReason.TIMEOUT]: "Timeout",
  [DownReason.STATUS]: "Wrong status code",
  [DownReason.BODY]: "Expected response not found",
  [DownReason.SSL]: "SSL error",
  [DownReason.NETWORK]: "Network error",
};
