export interface Monitor {
    id: string,
    monitorType: string,
    name: string,
    url: string,
    expectedStatus: number;
    interval: string;
    project: number;
    projectName: string,
    environment: number;
    envName: string;
    isUp?: boolean,
    lastChange?: string | null,
}

export interface NewMonitor {
    monitorType: string,
    name: string,
    url: string,
    expectedStatus: number;
    interval: string;
    projectId: number;
    environment: number;
}