import { moduleMetadata, Meta, Story } from "@storybook/angular";

import { CommonModule } from "@angular/common";

import { MonitorChartComponent } from "./monitor-chart.component";

import { mixedChecks, fewChecks } from "./mock-chart-data";

export default {
  component: MonitorChartComponent,
  decorators: [
    moduleMetadata({
      declarations: [MonitorChartComponent],
      imports: [CommonModule],
    }),
  ],
  title: "Uptime/MonitorChart",
  excludeStories: /.*Data$/,
} as Meta;

const Template: Story = (args) => ({
  props: {
    ...args,
  },
});

export const Default = Template.bind({});
Default.args = {
  data: [],
};

export const ManyChecks = Template.bind({});
ManyChecks.args = {
  data: mixedChecks,
};

export const FewChecks = Template.bind({});
FewChecks.args = {
  data: fewChecks,
};
