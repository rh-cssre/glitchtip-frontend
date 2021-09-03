import { MatIconModule } from "@angular/material/icon";
import { Meta, moduleMetadata } from "@storybook/angular";
import { ToDoItemComponent } from "./to-do-item.component";

export default {
  title: "shared/to-do-item",
  component: ToDoItemComponent,
  decorators: [moduleMetadata({ imports: [MatIconModule] })],
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
