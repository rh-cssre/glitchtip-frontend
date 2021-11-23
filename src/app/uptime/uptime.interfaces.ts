export type MonitorType = "Ping" | "GET" | "POST" | "Heartbeat";

export interface MonitorInput {
  monitorType: MonitorType;
  name: string;
  url: string;
  expectedStatus: number;
  interval: string;
  project: number | null;
}

export interface MonitorDetail extends MonitorInput {
  id: string;
  projectName: string | null;
  isUp: boolean | null;
  lastChange: string | null;
  heartbeatEndpoint: string | null;
}
