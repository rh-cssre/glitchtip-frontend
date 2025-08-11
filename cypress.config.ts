import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  trashAssetsBeforeRuns: true,
  retries: {
    runMode: 1,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    experimentalRunAllSpecs: true,
    baseUrl: "http://localhost:4200",
  },
});
