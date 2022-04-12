import { Stacktrace } from "./interfaces";

export function urlParamsToObject(url: string | null) {
  return url ? paramsToObject(new URLSearchParams(url.split("?")[1])) : null;
}

export function paramsToObject(entries: URLSearchParams) {
  const result: { [key: string]: string } = {};
  entries.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function isStacktrace(
  stacktrace?: {} | Stacktrace | null
): stacktrace is Stacktrace {
  return stacktrace ? (stacktrace as Stacktrace).frames !== undefined : false;
}
