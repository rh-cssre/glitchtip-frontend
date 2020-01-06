import { ProjectIssueView } from "../api/projects/projects.interfaces";

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
  annotations: string[];
  assignedTo: string | null;
  count: string;
  culprit: string;
  firstSeen: string;
  hasSeen: boolean;
  // id is a string in Sentry, but we would prefer a number if possible
  id: number;
  isBookmarked: boolean;
  isPublic: boolean;
  isSubscribed: boolean;
  lastSeen: string;
  level: string;
  logger: string | null;
  metadata: IIssueMetadata;
  numComments: number;
  permalink: string;
  project: ProjectIssueView;
  shareId: string | null;
  shortId: string;
  stats: IStats;
  status: IssueStatus;
  statusDetails: object;
  subscriptionDetails: string | null;
  title: string;
  type: string;
  userCount: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IssueDetail extends Issue {
  // https://docs.sentry.io/api/events/get-group-details/
  // https://docs.sentry.io/api/events/put-group-details/
}

export interface IssueWithSelected extends Issue {
  isSelected: boolean;
}

export interface RetrieveIssuesParams {
  cursor?: string;
  query?: string;
  project?: string;
}

export interface UpdateStatusResponse extends Issue {
  status: IssueStatus;
}

export interface IssueWithStatusandPlatform extends UpdateStatusResponse {
  platform: string;
}

type StatsPeriod = "24h" | "14d" | "";

type IStats = { [StatPeriod in StatsPeriod]?: number[][] };

interface IIssueMetadata {
  filename: string;
  type: string;
  value: string;
  // not in project issue list api
  function: string;
}
