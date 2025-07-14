import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
  type Preview,
} from "@storybook/angular";
import "@angular/localize/init";
import { MatIconRegistry } from "@angular/material/icon";
import { Component } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideMicroSentry } from "@micro-sentry/angular";
import { provideAnimations } from "@angular/platform-browser/animations";
import { withColorScheme } from "./decorators/with-color-scheme.decorator";

@Component({
  selector: "parent",
  template: `<ng-content></ng-content>`,
})
class ParentComponent {
  constructor(private matIconRegistry: MatIconRegistry) {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
    document.documentElement.classList.add("light");
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideMicroSentry({}),
        provideHttpClientTesting(),
        provideAnimations(),
        provideRouter([]),
      ],
    }),
    moduleMetadata({
      imports: [ParentComponent],
    }),
    componentWrapperDecorator(ParentComponent),
    withColorScheme,
  ],
};

export default preview;
