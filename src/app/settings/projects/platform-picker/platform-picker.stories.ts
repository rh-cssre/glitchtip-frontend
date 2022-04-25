import { MatExpansionModule } from "@angular/material/expansion";
import { moduleMetadata } from "@storybook/angular";

import { PlatformPickerComponent } from "./platform-picker.component";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";
import { MatTabsModule } from "@angular/material/tabs";

export default {
  title: "Project Settings/Platform Picker",
  decorators: [
    moduleMetadata({
      imports: [GlitchtipTestingModule, MatExpansionModule, MatTabsModule],
      declarations: [PlatformPickerComponent],
    }),
  ],
};

export const PlatformPickerButtons = () => {
  return {
    component: PlatformPickerComponent,
    props: {
      template: "buttons",
    },
  };
};

PlatformPickerButtons.story = {
  name: "Platform Picker (Buttons)",
};

export const PlatformPickerDropdown = () => {
  return {
    component: PlatformPickerComponent,
    props: {
      template: "dropdown",
    },
  };
};

PlatformPickerDropdown.story = {
  name: "Platform Picker (Dropdown)",
};
