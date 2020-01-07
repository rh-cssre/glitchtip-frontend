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
  culprit: string | null;
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
  metadata: IIssueMetadata | any;
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
  platform: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IssueDetail extends Issue {
  seenBy: object[];
  pluginIssues: string[];
  userReportCount: number;
  participants: string[];
  pluginActions: string[];
  tags: object[];
  firstRelease: IFirstRelase | null;
  pluginContexts: string[];
  lastRelease: string | null;
  activity: IActivity[];
  // https://docs.sentry.io/api/events/get-group-details/
  // https://docs.sentry.io/api/events/put-group-details/
}

export interface RetrieveIssuesParams {
  cursor?: string;
  query?: string;
  project?: string;
}

export interface UpdateStatusResponse extends Issue {
  status: IssueStatus;
}

// not in issues api reference, but is in issue list data
export interface IssueWithStatusAndPlatform extends UpdateStatusResponse {
  platform: string;
}

export interface IssueWithSelected extends IssueWithStatusAndPlatform {
  isSelected: boolean;
}

type StatsPeriod = "24h" | "14d" | "30d" | "";

type IStats = { [StatPeriod in StatsPeriod]?: number[][] };

interface IIssueMetadata {
  filename: string;
  type: string;
  value: string;
  function: string;
}

interface IFirstRelase {
  authors: string[];
  commitCount: number;
  data: object;
  dataCreated: string;
  dataReleased: string;
  deployCount: number;
  firstEvent: string;
  lastCommit: string | null;
  lastDeploy: string | null;
  lastEvent: string;
  newGroups: number;
  owner: string | null;
  projects: ProjectIssueView[];
  ref: string | null;
  shortVersion: string;
  url: string | null;
  version: string;
}

interface IActivity {
  data: object;
  dateCreated: string;
  id: string;
  type: string;
  user: string | null;
}
