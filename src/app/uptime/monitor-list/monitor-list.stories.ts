import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { of } from "rxjs";

import { Monitor } from "../uptime.interfaces";
import { MaterialModule } from "../../shared/material.module";
import { MonitorListComponent } from "./monitor-list.component";
import { MatTableModule } from "@angular/material/table";

export default {
  title: "Uptime Monitors List",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatTableModule
      ],
    }),
    withKnobs,
  ],
};

const sampleMonitors: Monitor[] = [
  {
    monitor_type: "Heartbeat",
    name: "Twitter",
    url: "https://twitter.com",
    isUp: true,
  },
  {
    monitor_type: "Ping",
    name: "Google",
    url: "https://www.google.com",
    isUp: false,
  },
  {
    monitor_type: "GET",
    name: "Twitter",
    url: "https://twitter.com",
    isUp: true,
  },
  {
    monitor_type: "POST",
    name: "Twitter",
    url: "https://twitter.com",
    isUp: false,
  },
  {
    monitor_type: "SSL",
    name: "Twitter",
    url: "https://twitter.com",
    isUp: true,
  },
];

export const monitorList = () => ({
  component: MonitorListComponent,
  props: {
    monitors$: of(sampleMonitors),
  },
});

monitorList.story = {
  parameters: {},
};
