import { ProjectReference } from "../api/projects/projects-api.interfaces";
import { Json } from "../interface-primitives";

interface Tag {
  key: string;
  value: string;
}

export interface EventTag extends Tag {
  _meta?: null | unknown;
  query?: string;
}

export interface Event {
  eventID: string;
  id: string;
  tags: EventTag[];
  projectID?: string | number;
  dateCreated: string | null;
  user: EndUser | null;
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

export interface EndUser {
  id: string | null;
  name: string | null;
  username?: string | null;
  email?: string | null;
  ip_address: string | null;
  data?: { [key: string]: string | null } | null;
}

export type EventTypes = "error" | "default";

export interface EventDetail extends Event {
  nextEventID: string | null;
  previousEventID: string | null;
  contexts: { [key: string]: { [key: string]: Json } } | null;
  entries: EntryUnion[];
  metadata: { [key: string]: string };
  dist?: unknown;
  userReport?: unknown;
  size?: number;
  errors?: Errors[] | [];
  type: "error" | "csp" | "default";
  groupingConfig?: GroupingConfig;
  dateReceived: string;
  packages: { [key: string]: string } | {} | null;
  sdk: { [key: string]: Json } | null;
  _meta?: { [key: string]: Json };
  fingerprints?: string[];
  context?: { [key: string]: Json } | null;
  release?: { [key: string]: Json[] } | null;
  sdkUpdates?: [];
}

export interface AnnotatedContexts {
  type: ContextsType;
  icon: string | null;
  matIcon: string | null;
  title: string;
  subtitle: string | null;
  key: string | null;
}

type ContextsType =
  | "user"
  | "browser"
  | "runtime"
  | "os"
  | "client_os"
  | "device"
  | "gpu";

interface Errors {
  data: { [key: string]: string };
  message: string;
  type: string;
}

export type EntryType =
  | "exception"
  | "breadcrumbs"
  | "request"
  | "message"
  | "csp";

export interface Entry<Type extends EntryType, Data extends {}> {
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

// https://docs.sentry.io/enriching-error-data/breadcrumbs/?platform=javascript
export interface Breadcrumb {
  message: string | null;
  category: string;
  data: { [key: string]: Json } | null;
  level: "fatal" | "error" | "warning" | "info" | "debug" | "sample";
  type: "default" | "http" | "error";
  event_id: string | null;
  timestamp: string; // technically a string, functionally a Date
}

export interface Message {
  formatted: string;
  message: string;
  params?: string[] | { [key: string]: string };
}

export interface CSP {
  [key: string]: string | number;
}

export interface ExceptionValueData {
  values: Values[];
  excOmitted?: boolean | null;
  hasSystemFrames?: boolean;
}

export interface Request {
  fragment?: string | null;
  cookies?: { [key: string]: Json }[];
  inferredContentType: string | null;
  env?: {
    SERVER_NAME: string;
    SERVER_PORT: string;
    DOCUMENT_ROOT?: string;
  } | null;
  headers: string[][];
  url: string;
  query?: { [key: string]: Json }[];
  data?: { [key: string]: string } | null;
  method?: string | null;
  query_string?: string[][];
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
  metadata: IssueMetadata;
  numComments: number;
  permalink: string;
  project: ProjectReference;
  shareId: string | null;
  shortId: string;
  stats: Stats;
  status: IssueStatus;
  statusDetails: { [key: string]: Json };
  subscriptionDetails: { [key: string]: Json } | null;
  title: string;
  type: string;
  userCount: number;
  platform?: string;
}

export interface IssueDetail extends Issue {
  seenBy: Json[];
  pluginIssues: string[];
  userReportCount: number;
  participants: Json[];
  pluginActions: string[];
  tags?: {
    name: string;
    key: string;
    uniqueValues: number;
  }[];
  firstRelease: FirstRelease | null;
  pluginContexts: string[];
  lastRelease: string | null;
  activity: Activity[];
}

export interface UpdateStatusResponse {
  status: IssueStatus;
}

// not in issues api reference, but is in issue list data

export interface IssueWithSelected extends Issue {
  isSelected: boolean;
  projectSlug: string;
}

export interface IssueWithMatchingEvent extends Issue {
  matchingEventId: string;
}

type StatsPeriod = "24h" | "14d" | "30d" | "";

type Stats = { [StatPeriod in StatsPeriod]?: number[][] };

export interface IssueMetadata {
  directive?: string;
  filename?: string;
  function?: string;
  message?: string;
  origin?: string;
  title?: string;
  type?: string;
  uri?: string;
  value?: string;
}

interface FirstRelease {
  authors: string[];
  commitCount: number;
  data: { [key: string]: Json };
  dataCreated: string;
  dataReleased: string;
  deployCount: number;
  firstEvent: string;
  lastCommit: string | null;
  lastDeploy: string | null;
  lastEvent: string;
  newGroups: number;
  owner: string | null;
  projects: ProjectReference[];
  ref: string | null;
  shortVersion: string;
  url: string | null;
  version: string;
}

interface Activity {
  data: { [key: string]: Json };
  dateCreated: string;
  id: string;
  type: string;
  user: Json | null;
}

export interface Values {
  stacktrace?: {} | Stacktrace | null;
  module?: string | null;
  rawStacktrace?: string | null;
  mechanism?: Mechanism | null;
  threadId?: number | null;
  value: string;
  type: string;
}

interface Mechanism {
  data?: { function: string };
  type: string;
  handled: boolean;
}

export interface Stacktrace {
  frames: Frame[];
  framesOmitted: unknown;
  registers: unknown;
  hasSystemFrames: boolean;
}

// tslint:disable-next-line:max-line-length
// https://gitlab.com/glitchtip/sentry-open-source/sentry-docs/-/blob/master/src/collections/_documentation/development/sdk-dev/event-payloads/stacktrace.md#frame-attributes
export interface Frame {
  absPath: string | null;
  filename: string | null;
  platform: string | null;
  module: string | null;
  function: string | null;
  rawFunction?: string | null;
  package: string | null;
  instructionAddr: string | null;
  symbol: string | null;
  symbolAddr: string | null;
  trust: string | null;
  inApp: boolean;
  context: FrameContextTuple[] | null;
  vars: { [key: string]: Json } | null;
  errors?: string | null;
  lineNo: number | null;
  colNo: number | null;
}

export interface FrameContextTuple extends Array<string | number> {
  0: number;
  1: string;
}

interface GroupingConfig {
  enhancements?: string;
  id: string;
}

export interface IssueTags {
  name: string;
  key: string;
  uniqueValues: number;
  topValues: TopValue[];
  totalValues: number;
}

interface TopValue extends Tag {
  count: number;
  name: string;
  lastSeen: string;
  firstSeen: string;
}

export interface IssueTagsAdjusted extends IssueTags {
  other?: number;
  topValues: TopValueAdjusted[];
}

interface TopValueAdjusted extends TopValue {
  percentRounded: number;
  percent: number;
}
