import { platforms, Integration, Platform } from "./platforms";

export interface FlatPlatform extends Integration {
  language: string;
}

const otherPlatform: Platform = {
  integrations: [
    {
      link: "",
      type: "language",
      id: "other",
      name: "Other",
    },
  ],
  id: "other",
  name: "Other",
};

export const otherPlatformFlat: FlatPlatform = {...otherPlatform.integrations[0], language: otherPlatform.id}

export const flattenedPlatforms: FlatPlatform[] = [...platforms, otherPlatform]
  .map((platform) => {
    const flatPlatforms: FlatPlatform[] = platform.integrations.map(
      (integration) => ({ ...integration, language: platform.id }),
    );
    return flatPlatforms;
  })
  // converts array of arrays to a single array
  // https://stackoverflow.com/a/18307218
  .reduce((a, b) => a.concat(b));

const languageNames = Object.fromEntries(
  platforms.map((platform) => [platform.id, platform.name]),
);

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9#+]+/g, " ")
    .trim();

const compact = (text: string) => text.replace(/ /g, "");

const hasWordStarting = (text: string, query: string) =>
  text.split(" ").some((word) => word.startsWith(query));

// Lower is a better match; -1 is no match.
function matchRank(platform: FlatPlatform, query: string) {
  const name = normalize(platform.name);
  if (compact(name) === compact(query)) return 0;
  if (compact(name).startsWith(compact(query))) return 1;
  if (hasWordStarting(name, query)) return 2;
  const language = normalize(languageNames[platform.language] ?? "");
  if (hasWordStarting(language, query)) return 3;
  return -1;
}

/** Platforms whose name or language has a word starting with the query, best match first. */
export function filterPlatforms(list: FlatPlatform[], query: string) {
  const normalized = normalize(query);
  if (!normalized) return list;
  return list
    .map((platform) => ({ platform, rank: matchRank(platform, normalized) }))
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => a.rank - b.rank)
    .map(({ platform }) => platform);
}
