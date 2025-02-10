import { platforms, Integration, Platform } from "./platforms";

interface FlatPlatform extends Integration {
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
