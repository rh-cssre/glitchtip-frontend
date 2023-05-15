// tslint:disable:max-line-length
import { HttpErrorResponse } from "@angular/common/http";

/**
 * generateClassName comes from
 * https://gitlab.com/glitchtip/sentry-open-source/sentry/-/blob/master/src/sentry/static/sentry/app/components/events/contextSummary.jsx#L11
 */
function generateClassName(name: string): string {
  return name
    .split(/\d/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, "")
    .replace(/\-+$/, "")
    .replace(/^\-+/, "");
}

/** Paths to different icon asset locations */
const browserPath = (name: string, extension = "svg"): string => {
  if (extension === "svg") {
    return `static/assets/images/browser-svgs/${name}/${name}.${extension}`;
  } else {
    return `static/assets/images/browser-svgs/${name}/${name}_48x48.${extension}`;
  }
};

const osPath = (name: string): string =>
  `static/assets/images/os-logos/${name}.png`;

const localPath = (name: string, type?: string): string =>
  `static/assets/images/logos/48x48/${name}.${type ? type : "png"}`;

export const iconDictionary: { [key: string]: string } = {
  /** Browsers */
  chrome: browserPath("chrome"),
  firefox: browserPath("firefox"),
  opera: browserPath("opera"),
  safari: browserPath("safari", "png"),
  mobilesafari: browserPath("safari-ios"),
  edge: browserPath("edge"),
  chromium: browserPath("chromium"),
  chromemobile: browserPath("chrome"),
  chromemobileios: browserPath("chrome"),
  qqbrowser: localPath("qqbrowser"),
  playstation: osPath("PS3"),
  internetexplorer: browserPath("internet-explorer-tile_10-11"),

  /** Operating Systems */
  ubuntu: osPath("UBT"),
  linux: osPath("LIN"),
  windows: osPath("WIN"),
  android: osPath("AND"),
  darwin: osPath("MAC"),
  ios: osPath("IOS"),
  macos: osPath("MAC"),
  tvos: osPath("ATV"),
  macosx: osPath("MAC"),
  mac: osPath("MAC"),
  apple: osPath("MAC"),
  watchos: osPath("WAS"),
  androidtablet: osPath("AND"),
  androidphone: osPath("AND"),
  watch: osPath("WAS"),
  appletv: osPath("ATV"),
  ipod: osPath("MAC"),
  iphone: osPath("IOS"),
  ipad: osPath("IPA"),
  redhat: osPath("RHT"),
  fedora: osPath("FED"),
  debian: osPath("DEB"),

  /** Frameworks */
  php: localPath("php", "jpg"),
  mono: localPath("mono"),
  netcore: localPath("dotnetcore"),
  netframework: localPath("dotnetframework"),
  electron: localPath("electron"),
  nvidia: localPath("nvidia"),
  amd: localPath("amd"),
  arm: localPath("arm", "jpg"),
  cpython: localPath("python", "svg"),
  ruby: localPath("ruby"),
  python: localPath("python", "svg"),
  go: localPath("go"),
};

/** Generates path to icons in iconDictionary */
export function generateIconPath(icon: string): string {
  const annotatedIconString = generateClassName(icon);
  return iconDictionary[annotatedIconString];
}

export const getUTM = () => {
  const allParams = new URLSearchParams(window.location.search);

  allParams.forEach((value, key) => {
    if (!key.startsWith("utm")) {
      allParams.delete(key);
    }
  });
  return allParams;
};

/** Set local storage value with ttl expiry in seconds */
export function setStorageWithExpiry(key: string, value: string, ttl: number) {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getStorageWithExpiry(key: string): null | string {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

/** For dynamically hiding tooltip based on screen size
 * See uptime monitor list component for assumed html/css structure
 */
export function checkForOverflow($event: Event) {
  const target = $event.target as HTMLElement;
  if (target.parentElement) {
    const maxWidth = target.parentElement!.offsetWidth;
    const span =
      target.tagName === "DIV"
        ? (target.firstElementChild as HTMLElement)
        : target;
    const textWidth = span ? span.offsetWidth : -1;
    return textWidth >= maxWidth ? false : true;
  }
  return true;
}

export function timedeltaToMS(value: string) {
  let milliseconds = 0;
  if (value.includes(" ")) {
    milliseconds += parseInt(value.split(" ")[0], 10) * 86400000;
    value = value.split(" ")[1];
  }
  const splitValue = value.split(":");
  milliseconds += parseInt(splitValue[0], 10) * 3600000;
  milliseconds += parseInt(splitValue[1], 10) * 60000;
  milliseconds += parseFloat(splitValue[2]) * 1000;
  if (isNaN(milliseconds)) {
    throw Error("Provided string was not a valid timedelta");
  }
  return Math.round(milliseconds);
}

export function normalizeProjectParams(
  projects: string | string[] | undefined
) {
  if (Array.isArray(projects)) {
    return projects.map((id) => parseInt(id, 10));
  }
  if (typeof projects === "string") {
    return [parseInt(projects, 10)];
  }
  return [];
}

export function parseErrorMessage(err: HttpErrorResponse): string[] {
  if (err.error && typeof err.error === "object") {
    const errorValues: string[][] = Object.values<string[]>(err.error);
    return errorValues.reduce((a, v) => a.concat(v), []);
  } else {
    return [err.message];
  }
}
