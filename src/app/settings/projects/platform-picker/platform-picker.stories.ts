import { PlatformPickerComponent } from "./platform-picker.component";



export default {
  title: "Project Settings/Platform Picker",
  component: PlatformPickerComponent,
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
