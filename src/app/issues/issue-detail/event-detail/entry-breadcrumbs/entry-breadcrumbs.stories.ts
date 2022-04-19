import { moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";

import { EntryBreadcrumbsComponent } from "../entry-breadcrumbs/entry-breadcrumbs.component";

import { databaseStackError } from "../test-data/database-stack-error";
import { breadcrumbError } from "../test-data/breadcrumb-error";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";

export default {
  title: "Events/Event Detail/Entry Breadcrumbs",
  component: EntryBreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [GlitchtipTestingModule],
    }),
  ],
};

export const BreadcrumbsShort = () => {
  return {
    props: {
      breadcrumbs$: of(databaseStackError.entries[1].data),
    },
  };
};

export const BreadcrumbsMedium = () => {
  const mediumLength: any = {
    values: [
      {
        category: "console",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.476Z",
        data: {
          logger: "console",
          extra: {
            arguments: [
              "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
            ],
          },
        },
        message:
          "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
        type: "default",
      },
      {
        category: "ui.click",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.548Z",
        data: null,
        message: "body > app-root > ol > li > a",
        type: "default",
      },
      {
        category: "xhr",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.569Z",
        data: {
          url: "http://localhost:4200/sockjs-node/info?t=1580242793552",
          status_code: 200,
          method: "GET",
        },
        message: null,
        type: "http",
      },
      {
        category: "ui.click",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:55.949Z",
        data: null,
        message: "body > app-root > ol > li > a",
        type: "default",
      },
      {
        category: "console",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.476Z",
        data: {
          logger: "console",
          extra: {
            arguments: [
              "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
            ],
          },
        },
        message:
          "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
        type: "default",
      },
      {
        category: "ui.click",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.548Z",
        data: null,
        message: "body > app-root > ol > li > a",
        type: "default",
      },
      {
        category: "xhr",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.569Z",
        data: {
          url: "http://localhost:4200/sockjs-node/info?t=1580242793552",
          status_code: 200,
          method: "GET",
        },
        message: null,
        type: "http",
      },
      {
        category: "ui.click",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:55.949Z",
        data: null,
        message: "body > app-root > ol > li > a",
        type: "default",
      },
      {
        category: "console",
        level: "info",
        event_id: null,
        timestamp: "2020-01-28T20:19:53.476Z",
        data: {
          logger: "console",
          extra: {
            arguments: [
              "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
            ],
          },
        },
        message:
          "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
        type: "default",
      },
    ],
  };
  return {
    props: {
      breadcrumbs$: of(mediumLength),
    },
  };
};

export const BreadcrumbsLong = () => {
  return {
    props: {
      breadcrumbs$: of(breadcrumbError.entries[1].data),
    },
  };
};
