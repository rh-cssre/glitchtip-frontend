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
import { TimeForPipe } from "src/app/shared/days-ago.pipe";

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
      declarations: [ TimeForPipe ],
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
    lastChange: "2021-10-19T15:39:31Z",
  },
  {
    monitor_type: "Ping",
    name: "Google",
    url: "https://www.google.com",
    isUp: false,
    lastChange: "2021-10-19T14:39:31Z",
  },
  {
    monitor_type: "GET",
    name: "Dev Website",
    url: "https://something.com",
    isUp: true,
    lastChange: "2021-10-19T12:39:31Z",
  },
  {
    monitor_type: "POST",
    name: "A really long name for someone with nothing to think about",
    url: "https://something.com",
    isUp: false,
    lastChange: "2021-09-19T15:39:31Z",
  },
  {
    monitor_type: "SSL",
    name: "Test Website",
    url: "https://something.com",
    isUp: true,
    lastChange: "202-10-19T1:39:31Z"
  },
  {
    monitor_type: "SSL",
    name: "A really long name for someone with nothing to think about",
    url: "https://something.com/nothing/anything/test/123xyz",
    isUp: false,
    lastChange: null,
  },
  {
    monitor_type: "SSL",
    name: "Inactive Website",
    url: "https://something.com",
    isUp: false,
    lastChange: null,
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
