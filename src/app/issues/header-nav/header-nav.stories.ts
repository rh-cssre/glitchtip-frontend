import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { MaterialModule } from "src/app/shared/material.module";
import { HeaderNavComponent } from "./header-nav.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export default {
  title: "Issue Header Nav",
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, ReactiveFormsModule, BrowserAnimationsModule]
    }),
    withKnobs
  ]
};

export const headerNav = () => ({
  component: HeaderNavComponent,
  props: {
    projects: [
      "GlitchTip",
      "SwitchGrip",
      "PitchFlip",
      "StitchStrip",
      "NicheScrip",
      "TwitchQuip",
      "Wassilievitch Proprietorship"
    ],
    appliedProjects: ["SwitchGrip", "StitchStrip", "NicheScrip"]
  }
});

headerNav.story = {
  parameters: {}
};
