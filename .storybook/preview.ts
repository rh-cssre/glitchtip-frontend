import { importProvidersFrom } from "@angular/core";
import { withThemeByClassName } from "@storybook/addon-themes";
import { applicationConfig } from "@storybook/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MicroSentryModule } from "@glitchtip/micro-sentry-angular";

export const decorators = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
  applicationConfig({
    providers: [
      importProvidersFrom(MatSnackBarModule),
      importProvidersFrom(HttpClientModule),
      importProvidersFrom(RouterTestingModule),
      importProvidersFrom(NoopAnimationsModule),
      importProvidersFrom(MicroSentryModule.forRoot({})),
    ],
  }),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
