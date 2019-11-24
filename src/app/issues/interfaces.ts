export interface IEvent {
  event_id: string;
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
  level: string;
  platform: string;
  sdk: {
    name: string;
    version: string;
    packages: {
      name: string;
      version: string;
    }[];
    integrations: string[];
  };
  release: string;
  request: {
    url: string;
    headers: {
      "User-Agent": string;
    };
  };
  breadcrumbs: any;
  received_at: string;
}

export interface Issue {
  id: number;
  title: string;
  location: string;
  event: IEvent[];
}
