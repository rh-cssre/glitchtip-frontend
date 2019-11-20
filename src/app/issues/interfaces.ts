export interface IEvent {
  exception: {
    values: [
      {
        type: string; // "Error"
        value: string;
        stacktrace: {
          frames: {
            colno: number;
            filename: string;
            function: string;
            in_app: boolean;
            lineno: number;
          }[];
        };
        mechanism: {
          handled: boolean;
          type: string; // "generic"
        };
      }
    ];
  };
  level: string; // "error"
  event_id: string;
  platform: string; // "javascript"
  request: {
    url: string;
    headers: {
      "User-Agent": string;
    };
  };
  sdk: any;
  release: any;
  breadcrumbs: any;
  //   sdk: {
  //     name: string; // "sentry.javascript.browser"
  //     packages: [
  //       {
  //         name: string; // "npm:@sentry/browser"
  //         version: string; // "5.7.1"
  //       }
  //     ];
  //     version: string; // "5.7.1"
  //     integrations: string[];
  //   };
  //   release: string;
  //   breadcrumbs: [
  //     {
  //       timestamp: number; // in milliseconds I think
  //       category: string; // "xhr"
  //       data: {
  //         method: string; // "GET"
  //         url: string;
  //         status_code: number;
  //       };
  //       type: string; // "http";
  //     },
  //     {
  //       timestamp: number;
  //       category: string; // "console";
  //       data: {
  //         extra: {
  //           arguments: string[];
  //         };
  //         logger: string;
  //       };
  //       level: string;
  //       message: string;
  //     }
  //   ];
}
