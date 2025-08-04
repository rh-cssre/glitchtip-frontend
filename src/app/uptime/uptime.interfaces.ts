import { Series, DataItem } from "@swimlane/ngx-charts";

export type MonitorType =
  | "Ping"
  | "GET"
  | "POST"
  | "Heartbeat"
  | "SSL"
  | "TCP Port";
export enum DownReason {
  UNKNOWN = 0,
  TIMEOUT = 1,
  STATUS = 2,
  BODY = 3,
  SSL = 4,
  NETWORK = 5,
}

interface MonitorBase {
  monitorType: MonitorType;
  name: string;
  interval: number;
  expectedStatus: number | null;
  expectedBody: string;
  url: string;
}

export interface MonitorInput extends MonitorBase {
  project?: string | null;
  timeout?: number | null;
}

export interface ResponseTimeDataItem extends Omit<DataItem, "name"> {
  name: Date;
}

export interface ResponseTimeSeries extends Omit<Series, "series"> {
  series: ResponseTimeDataItem[];
}
