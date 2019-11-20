import { IEvent } from "../interfaces";

export const sampleEvent: IEvent = {
  id: 1,
  event: {
    event_id: "1b80eac8-8dad-40ee-abe6-356db6f9359d",
    exception: {
      values: [
        {
          type: "Error",
          value: "blarg",
          mechanism: {
            type: "generic",
            handled: true
          },
          stacktrace: {
            frames: [
              {
                colno: 29,
                in_app: true,
                lineno: 5656,
                filename: "http://localhost:4200/polyfills.js",
                function: "timer"
              },
              {
                colno: 48,
                in_app: true,
                lineno: 3460,
                filename: "http://localhost:4200/polyfills.js",
                function: "ZoneTask.invoke"
              }
            ]
          }
        }
      ]
    }
  }
};
