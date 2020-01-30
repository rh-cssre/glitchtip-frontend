import { ProjectIssueView } from "../api/projects/projects.interfaces";

export interface Event {
  eventID: string;
  tags: any[];
  projectID: string;
  dateCreated: string;
  user: any;
  message: string;
  id: string;
  culprit: string;
  title: string;
  location: string;
  crashFile: string | null;
  groupID: string;
  // made undefined because EventDetail extends this and didn't need it
  "event.type"?: EventTypes;
  platform: string;
}

export type EventTypes = "error" | "default";

export interface EventDetail extends Event {
  nextEventID: string | null;
  previousEventID: string | null;
  contexts: IContext;
  entries: IEntryStreamField[];
  metadata: IEventMetaData | any;
  dist: null;
  userReport: null;
  size: number;
  errors: any[];
  type: "error";
  groupingConfig: GroupingConfig;
  dateReceived: string;
  packages: any;
  sdk: any;
  _meta: any;
  fingerprints: string[];
  context: { "sys.argv"?: string[]; arguments?: [] };
  release: any;
}

export interface IEntryStreamfieldBlock<Type extends string, Data extends {}> {
  data: Data;
  type: Type;
}

export type IEntryStreamField =
  | IEntryStreamfieldBlock<"exception", ExceptionValueData>
  | IEntryStreamfieldBlock<"breadcrumbs", BreadcrumbValueData>
  | IEntryStreamfieldBlock<"request", IRequest>;

export interface BreadcrumbValueData {
  values: Breadcrumb[];
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

export interface RequestUrls {
  domainName?: string;
  path?: string;
}

export interface IRequest extends RequestUrls {
  fragment: string | null;
  cookies: object[];
  inferredContentType: string | null;
  env: object | null;
  headers: string[][];
  url: string;
  query: object[];
  data: RequestData | null;
  method: string | null;
}

interface RequestData {
  csrfmiddlewaretoken: string;
  param1: string;
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
  metadata: IIssueMetadata | any;
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

export interface RetrieveIssuesParams {
  cursor?: string;
  query?: string;
  project?: string;
}

export interface UpdateStatusResponse {
  status: IssueStatus;
}

// not in issues api reference, but is in issue list data

export interface IssueWithSelected extends UpdateStatusResponse {
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
  user: any | null;
}

interface ITag {
  totalValues: number;
  name: string;
  key: string;
}

interface IContext {
  runtime?: Runtime;
  trace?: Trace;
  os: IContextDetail;
  browser: IContextDetail;
}

interface Trace {
  description: string;
  parent_span_id: string;
  trace_id: string;
  span_id: string;
  type: string;
  op: string;
}

interface Runtime {
  version: string;
  type: string;
  build: string;
  name: string;
}

interface IContextDetail {
  version?: string;
  type: string;
  name: string;
}

interface Values {
  stacktrace: IStacktrace;
  module: string | null;
  rawStacktrace: string | null;
  mechanism: Mechanism;
  threadId: number | null;
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
  vars: Vars | null;
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

interface Vars {
  __class__?: string;
  _prefix?: string;
  args?: [];
  bit?: string;
  callback?: string;
  bits?: string[];
  callback_args?: [];
  callback_kwargs?: {};
  clone?: string;
  cls?: string;
  context?: { view: string } | string;
  current_app?: string;
  current_path?: string;
  exc?: string;
  get_response?: string;
  handler?: string;
  initkwargs?: object;
  key?: string;
  kwargs?: object;
  limit?: string;
  lookup_view?: string;
  lookup_view_s?: string;
  m?: string;
  middleware_method?: string;
  msg?: string;
  n?: string;
  name?: string;
  NoReverseMatch?: string;
  node?: string;
  num?: string;
  path?: [];
  patterns?: [];
  possibilities?: [];
  prefix?: string;
  request?: string;
  resolver?: string;
  resolver_match?: string;
  response?: string;
  retval?: string;
  reverse?: string;
  self?: any;
  template?: string;
  url?: string;
  urlconf?: string;
  users?: string;
  view?: string;
  view_name?: string;
  viewname?: string;
  wrapped_callback?: string;
}

interface IEventMetaData {
  function: string;
  type: string;
  value: string;
  filename: string;
}

interface GroupingConfig {
  enhancements?: string;
  id: string;
}
