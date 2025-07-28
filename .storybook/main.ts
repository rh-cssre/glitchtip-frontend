import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  staticDirs: [
    {
      from: "../node_modules/@browser-logos",
      to: "/static/assets/images/browser-svgs",
    },
    {
      from: "../node_modules/@egoistdeveloper/operating-system-logos/src/48x48",
      to: "static/assets/images/os-logos",
    },
    { from: "../src/assets", to: "/static/assets" },
  ],
};
export default config;
