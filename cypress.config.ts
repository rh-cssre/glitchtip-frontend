import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  trashAssetsBeforeRuns: true,
  retries: {
    runMode: 1,
  },
  e2e: {
    setupNodeEvents(on) {
      // High-res screenshots when the SCREENSHOT env var is set.
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (
          browser.name === "electron" &&
          browser.isHeadless &&
          process.env.SCREENSHOT
        ) {
          launchOptions.preferences.width = 2570;
          launchOptions.preferences.height = 1600;
          launchOptions.preferences.webPreferences.zoomFactor = 2;
        }
        return launchOptions;
      });
    },
    viewportWidth: 1280,
    experimentalRunAllSpecs: true,
    baseUrl: "http://localhost:4200",
  },
});
