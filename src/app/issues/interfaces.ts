import { ProjectIssueView } from "../api/projects/projects.interfaces";

export interface Event {
  eventID: string;
  id: string;
  tags: any[];
  projectID?: string;
  dateCreated: string | null;
  user?: any;
  message?: string;
  culprit: string;
  title: string;
  location?: string;
  crashFile?: string | null;
  groupID?: string;
  // made undefined because EventDetail extends this and didn't need it
  "event.type"?: EventTypes;
  platform: string;
}

export type EventTypes = "error" | "default";

export interface EventDetail extends Event {
  nextEventID: string | null;
  previousEventID: string | null;
  contexts: { [key: string]: any } | null;
  entries: EntryUnion[];
  metadata: EventMetadata | any;
  dist?: null;
  userReport?: null;
  size?: number;
  errors?: any[];
  type: "error" | "csp" | "default";
  groupingConfig?: GroupingConfig;
  dateReceived: string;
  packages: any;
  sdk: any;
  _meta?: any;
  fingerprints?: string[];
  context?: { [key: string]: any[] };
  release?: any;
  issue?: number;
  sdkUpdates?: [];
}

export interface Entry<Type extends string, Data extends {}> {
  data: Data;
  type: Type;
}

export type EntryUnion =
  | Entry<"exception", ExceptionValueData>
  | Entry<"breadcrumbs", BreadcrumbValueData>
  | Entry<"request", Request>
  | Entry<"message", Message>
  | Entry<"csp", CSP>;

export interface BreadcrumbValueData {
  values: Breadcrumb[];
}

export interface Message {
  formatted: string;
}

export interface CSP {
  [key: string]: string | number;
}

// https://docs.sentry.io/enriching-error-data/breadcrumbs/?platform=javascript
export interface Breadcrumb {
  message: string | null;
  category: string;
  data: any;
  level: "fatal" | "error" | "warning" | "info" | "debug";
  type: "default" | "http" | "error";
  event_id: null;
  timestamp: string; // technically a string, functionally a Date
}

export interface ExceptionValueData {
  values: Values[];
  excOmitted: boolean | null;
  hasSystemFrames: boolean;
}

export interface Request {
  fragment?: string | null;
  cookies?: object[];
  inferredContentType: string | null;
  env: { SERVER_NAME: string; SERVER_PORT: string } | null;
  headers: string[][];
  url: string;
  query?: object[];
  data?: { [key: string]: string } | null;
  method: string | null;
  query_string?: string;
}

export interface AnnotatedRequest extends Request {
  domainName: string;
  path: string;
}

export type IssueStatus = "resolved" | "unresolved" | "ignored";

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
  metadata: IssueMetadata | any;
  numComments: number;
  permalink: string;
  project: ProjectIssueView;
  shareId: string | null;
  shortId: string;
  stats: IStats;
  status: IssueStatus;
  statusDetails: object;
  subscriptionDetails: object | null;
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
  participants: any[];
  pluginActions: string[];
  tags: ITag[];
  firstRelease: IFirstRelase | null;
  pluginContexts: string[];
  lastRelease: string | null;
  activity: IActivity[];
}

export interface UpdateStatusResponse {
  status: IssueStatus;
}

// not in issues api reference, but is in issue list data

export interface IssueWithSelected extends Issue {
  isSelected: boolean;
  projectSlug: string;
}

type StatsPeriod = "24h" | "14d" | "30d" | "";

type IStats = { [StatPeriod in StatsPeriod]?: number[][] };

export interface IssueMetadata {
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
  user: any | null;
}

interface ITag {
  totalValues: number;
  name: string;
  key: string;
}

interface Values {
  stacktrace: IStacktrace;
  module: string | null;
  rawStacktrace?: string | null;
  mechanism?: Mechanism;
  threadId?: number | null;
  value: string;
  type: string;
}

interface Mechanism {
  data?: { function: string };
  type: string;
  handled: boolean;
}

interface IStacktrace {
  frames: Frame[];
  framesOmitted: null;
  registers: null;
  hasSystemFrames: boolean;
}

interface Frame {
  function: string | null;
  errors: string | null;
  colNo: number | null;
  vars: { [key: string]: any } | null;
  package: string | null;
  absPath: string;
  inApp: boolean;
  lineNo: number;
  module: string | null;
  filename: string;
  platform: string | null;
  instructionAddr: string | null;
  context: (string | number)[][];
  symbolAddr: string | null;
  trust: string | null;
  symbol: string | null;
  rawFunction?: string | null;
}

interface EventMetadata {
  function: string;
  type: string;
  value: string;
  filename: string;
}

interface GroupingConfig {
  enhancements?: string;
  id: string;
}
