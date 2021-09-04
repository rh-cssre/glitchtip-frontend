import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from "@storybook/angular";
import { SharedModule } from "../shared.module";
import { ToDoItemComponent } from "./to-do-item.component";

export default {
  title: "shared/to-do-item",
  component: ToDoItemComponent,
  decorators: [
    moduleMetadata({ imports: [SharedModule] }),
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
