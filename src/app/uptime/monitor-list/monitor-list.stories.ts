import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";
import { of } from "rxjs";
import { MaterialModule } from "../../shared/material.module";
import { MonitorListComponent } from "./monitor-list.component";
import { MatTableModule } from "@angular/material/table";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { sampleMonitors } from "../test-data";

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
        MatTableModule,
      ],
      declarations: [TimeForPipe],
    }),
    withKnobs,
  ],
};

export const monitorListItem = () => {
  const statesDefaultValue = "normal";
  const statesOptions = {
    Normal: statesDefaultValue,
    "No monitors": "nomonitors",
    "Paginated monitors": "paginatedList",
    Loading: "loading",
  };
  const states = select("States", statesOptions, statesDefaultValue);

  const sensibleDefaults = {
    loading: false,
  };

  const pageStateConfig: any = {
    normal: {
      ...sensibleDefaults,
      monitorCount: 8,
    },
    nomonitors: {
      ...sensibleDefaults,
      monitorCount: 0,
    },
    paginatedList: {
      ...sensibleDefaults,
      monitorCount: 52,
    },
    loading: {
      ...sensibleDefaults,
      loading: true,
      monitorCount: 8,
    },
  };
  issues$: of;
  return {
    component: MonitorListComponent,
    props: {
      loading$: of(pageStateConfig[states].loading),
      monitors$: of(
        sampleMonitors.slice(0, pageStateConfig[states].monitorCount)
      ),
    },
  };
};

monitorListItem.story = {
  name: "Monitor List",
};

// export const monitorList = () => ({
//   component: MonitorListComponent,
//   props: {
//     monitors$: of(sampleMonitors),
//   },
// });

monitorListItem.story = {
  parameters: {},
};
