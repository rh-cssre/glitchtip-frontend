import { componentWrapperDecorator } from "@storybook/angular";
import { Meta } from "@storybook/angular";
import { FormErrorComponent } from "./form-error.component";

export default {
  title: "shared/forms/form-error",
  component: FormErrorComponent,
  decorators: [
    componentWrapperDecorator((story) => `<mat-card>${story}</mat-card>`),
  ],
} as Meta;

export const One = () => ({
  props: {
    error: { non_field_errors: ["Something went wrong"] },
  },
});

export const Many = () => ({
  props: {
    error: {
      non_field_errors: [
        "Something went wrong",
        "Another thing went wrong too",
      ],
    },
  },
});
