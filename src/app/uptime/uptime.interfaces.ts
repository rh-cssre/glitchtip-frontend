export interface Monitor {
    id: string,
    monitor_type: string,
    name: string,
    url: string,
    is_up: boolean,
    last_change: string | null,
}