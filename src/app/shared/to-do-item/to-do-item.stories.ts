import { componentWrapperDecorator, Meta } from "@storybook/angular";
import { ToDoItemComponent } from "./to-do-item.component";

export default {
  title: "shared/to-do-item",
  component: ToDoItemComponent,
  decorators: [
    componentWrapperDecorator((story) => `<mat-card>${story}</mat-card>`),
  ],
} as Meta;

export const NotDone = () => ({
  props: {
    title: "You'll need to do this",
  },
});

export const Doing = () => ({
  props: {
    title: "Doing it now",
    isDone: "doing",
  },
});

export const Done = () => ({
  props: {
    title: "You did it",
    isDone: "true",
  },
});
