import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata } from "@storybook/angular";

import { MaterialModule } from "../material.module";
import { CopyInputComponent } from "../copy-input/copy-input.component";

export default {
  title: "Shared/Copy Input",
  component: CopyInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
};

export const CopyInput = () => {
  return {

    props: {
      value: "Some copying value",
      placeholder: "placeholder",
    },
  };
};

CopyInput.story = {
  name: "Ready only, copyable input",
};
