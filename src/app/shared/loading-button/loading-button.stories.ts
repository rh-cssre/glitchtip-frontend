import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata, Story } from "@storybook/angular";

import { MaterialModule } from "../material.module";
import { LoadingButtonComponent } from "../loading-button/loading-button.component";

export default {
  title: "Shared/Loading button",
  component: LoadingButtonComponent,
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
  argTypes: {
    buttonText: {
      options: ["Button Text", "ClickMe"],
      control: { type: "select" },
    },
    loading: {
      options: [true, false],
    },
  },
};

export const LoadingButton: Story = (args) => {
  const { buttonText, loading } = args;
  return {
    props: {
      buttonText,
      loading,
    },
  };
};

LoadingButton.story = {
  name: "Button with Loading State",
};
