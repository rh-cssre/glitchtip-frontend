import { CopyInputComponent } from "../copy-input/copy-input.component";

export default {
  title: "Shared/Copy Input",
  component: CopyInputComponent,
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
