import { moduleMetadata, Meta, Story } from "@storybook/angular";

import { CommonModule } from "@angular/common";

import { MonitorChartComponent } from "./monitor-chart.component";

export default {
  component: MonitorChartComponent,
  decorators: [
    moduleMetadata({
      declarations: [MonitorChartComponent],
      imports: [CommonModule],
    }),
  ],
  title: "Task",
  excludeStories: /.*Data$/,
} as Meta;

// const Template: Story = (args) => ({
//   props: {
//     ...args,
//     onPinTask: actionsData.onPinTask,
//     onArchiveTask: actionsData.onArchiveTask,
//   },
// });

// export const Default = Template.bind({});
// Default.args = {
//   task: {
//     id: "1",
//     title: "Test Task",
//     state: "TASK_INBOX",
//     updatedAt: new Date(2021, 0, 1, 9, 0),
//   },
// };

// export const Pinned = Template.bind({});
// Pinned.args = {
//   task: {
//     ...Default.args.task,
//     state: "TASK_PINNED",
//   },
// };

// export const Archived = Template.bind({});
// Archived.args = {
//   task: {
//     ...Default.args.task,
//     state: "TASK_ARCHIVED",
//   },
// };
