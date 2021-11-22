export interface NewMonitor {
    monitorType: "Ping" | "GET" | "POST" | "Heartbeat"
    name: string;
    url: string;
    expectedStatus: number;
    interval: string;
    project?: number;
}

export interface MonitorDetail extends NewMonitor {
    id: string;
    projectName?: string;
    isUp?: boolean;
    lastChange?: string | null;
    heartbeatEndpoint?: string | null;
}
