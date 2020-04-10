import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "../shared/material.module";
import { RegisterComponent } from "./register.component";

export default {
  title: "Register",
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
      ],
    }),
    withKnobs,
  ],
};

export const register = () => ({
  component: RegisterComponent,
  props: {},
});

register.story = {
  parameters: {
    name: "Profile Page",
  },
};
