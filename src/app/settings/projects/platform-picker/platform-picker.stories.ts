import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PlatformPickerComponent } from "./platform-picker.component";
import { SettingsModule } from "../../settings.module";

export default {
  title: "Project Settings/Platform Picker",
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SettingsModule,
      ],
      declarations: [],
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
