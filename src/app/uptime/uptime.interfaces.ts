export interface Monitor {
    id: string,
    monitor_type: string,
    name: string,
    url: string,
    isUp: boolean,
    lastChange: string | null,
}