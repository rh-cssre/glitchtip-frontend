export interface Event {
  eventId: string;
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

export interface EventDetail extends Event {
  nextEventID: string | null;
  previousEventID: string | null;
}

export type IssueStatus = "resolved" | "unresolved";

export interface Issue {
  id: number;
  title: string;
  location: string;
  status: IssueStatus;
}

// tslint:disable-next-line:no-empty-interface
export interface IssueDetail extends Issue {}

export interface IssueWithSelected extends Issue {
  isSelected: boolean;
}

export interface UpdateStatusResponse {
  status: IssueStatus;
}
