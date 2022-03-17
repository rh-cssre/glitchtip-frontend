import { moduleMetadata, Meta, Story } from "@storybook/angular";

import { CommonModule } from "@angular/common";

import { MonitorResponseChartComponent } from "./monitor-response-chart.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxChartsModule } from "@swimlane/ngx-charts";

import { test, raw } from "./test-data";

export default {
  component: MonitorResponseChartComponent,
  decorators: [
    moduleMetadata({
      declarations: [MonitorResponseChartComponent],
      imports: [CommonModule, NgxChartsModule, BrowserAnimationsModule],
    }),
  ],
  title: "Uptime/MonitorResponseChart",
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
  raw: [],
};

export const FirstTest = Template.bind({});
FirstTest.args = {
  data: test,
  raw: raw
};