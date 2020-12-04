// tslint:disable:max-line-length

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
const browserPath = (
  name: string,
  extension = "svg",
  isArchive = false
): string =>
  `assets/images/browser-svgs/${
    isArchive ? "archive/" : ""
  }${name}/${name}.${extension}`;

const osPath = (name: string): string => `assets/images/os-logos/${name}.png`;

const localPath = (name: string, type?: string): string =>
  `assets/images/logos/48x48/${name}.${type ? type : "png"}`;

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
  playstation: osPath("playstation"),
  internetexplorer: browserPath(
    "internet-explorer-tile_10-11",
    undefined,
    true
  ),

  /** Operating Systems */
  ubuntu: osPath("ubuntu"),
  linux: osPath("linux"),
  windows: osPath("windows"),
  android: osPath("android"),
  darwin: osPath("mac"),
  ios: osPath("ios"),
  macos: osPath("mac"),
  tvos: osPath("mac"),
  macosx: osPath("mac"),
  mac: osPath("mac"),
  apple: osPath("mac"),
  watchos: osPath("mac"),
  androidtablet: osPath("android"),
  androidphone: osPath("android"),
  watch: osPath("mac"),
  appletv: osPath("apple-tv"),
  ipod: osPath("mac"),
  iphone: osPath("mac"),
  ipad: osPath("mac"),
  redhat: osPath("red-hat"),
  fedora: osPath("fedora"),
  debian: osPath("debian"),

  /** Frameworks */
  php: localPath("php", "jpg"),
  mono: localPath("mono"),
  netcore: localPath("dotnetcore"),
  netframework: localPath("dotnetframework"),
  electron: localPath("electron"),
  nvidia: localPath("nvidia"),
  amd: localPath("amd"),
  arm: localPath("arm", "jpg"),
  cpython: localPath("cpython"),
  python: localPath("python"),
  go: localPath("go"),
};

/** Generates path to icons in iconDictionary */
export function generateIconPath(icon: string): string {
  const annotatedIconString = generateClassName(icon);
  return iconDictionary[annotatedIconString];
}
