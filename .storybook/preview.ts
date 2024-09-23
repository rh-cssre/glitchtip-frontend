import { importProvidersFrom } from "@angular/core";
import { withThemeByClassName } from "@storybook/addon-themes";
import { applicationConfig } from "@storybook/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MicroSentryModule } from "@micro-sentry/angular";

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
      importProvidersFrom(HttpClientTestingModule),
      importProvidersFrom(RouterTestingModule),
      provideAnimations(),
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
export const tags = ["autodocs"];
