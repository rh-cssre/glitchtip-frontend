import { Stacktrace } from "./interfaces";

export function isStacktrace(
  stacktrace?: {} | Stacktrace | null,
): stacktrace is Stacktrace {
  return stacktrace ? (stacktrace as Stacktrace).frames !== undefined : false;
}
