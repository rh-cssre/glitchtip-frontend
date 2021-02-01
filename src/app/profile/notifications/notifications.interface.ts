import { Project } from "src/app/api/projects/projects-api.interfaces";

export interface SubscribeByDefault {
  subscribeByDefault: boolean;
}

export type NotificationStatus = number;

export interface ProjectWithAlertStatus extends Project {
  alertStatus: NotificationStatus;
}

export interface ProjectAlerts {
  [key: string]: NotificationStatus;
}

export interface GroupedProjects {
  [key: number]: ProjectWithAlertStatus[];
}

export interface ProjectError {
  error: string;
  id: string;
}
