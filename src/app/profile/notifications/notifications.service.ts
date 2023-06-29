import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, combineLatest } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import { HttpClient } from "@angular/common/http";
import { ProjectsService } from "src/app/projects/projects.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  GroupedProjects,
  ProjectError,
  ProjectWithAlertStatus,
  NotificationStatus,
  ProjectAlerts,
  SubscribeByDefault,
} from "./notifications.interface";

interface NotificationsState {
  projectViewExpanded: boolean;
  subscribeByDefault: boolean;
  subscribeByDefaultLoading: boolean;
  subscribeByDefaultError: string;
  groupedProjects: GroupedProjects;
  projectAlertLoading: number | null;
  projectAlertError: ProjectError | null;
}

const initialState: NotificationsState = {
  projectViewExpanded: false,
  subscribeByDefault: true,
  subscribeByDefaultLoading: false,
  subscribeByDefaultError: "",
  groupedProjects: [],
  projectAlertLoading: null,
  projectAlertError: null,
};

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  private readonly notificationsState = new BehaviorSubject<NotificationsState>(
    initialState
  );
  private readonly getState$ = this.notificationsState.asObservable();
  private readonly url = `${baseUrl}/users/me/notifications/`;
  readonly subscribeByDefault$ = this.getState$.pipe(
    map((data) => data.subscribeByDefault)
  );
  readonly projectViewExpanded$ = this.getState$.pipe(
    map((data) => data.projectViewExpanded)
  );
  readonly subscribeByDefaultLoading$ = this.getState$.pipe(
    map((data) => data.subscribeByDefaultLoading)
  );
  readonly subscribeByDefaultError$ = this.getState$.pipe(
    map((data) => data.subscribeByDefaultError)
  );
  readonly groupedProjects$ = this.getState$.pipe(
    map((data) => data.groupedProjects)
  );
  readonly projectAlertLoading$ = this.getState$.pipe(
    map((data) => data.projectAlertLoading)
  );
  readonly projectAlertsError$ = this.getState$.pipe(
    map((data) => data.projectAlertError)
  );

  constructor(
    private projectsService: ProjectsService,
    private http: HttpClient
  ) {}

  subscribeToEndpoints() {
    this.notificationsList();
    this.retrieveUserAlertSettings();
    this.projectsService.retrieveProjects();
  }

  notificationsList() {
    return this.http
      .get<SubscribeByDefault>(this.url)
      .pipe(tap((resp) => this.setSubscribeByDefault(resp.subscribeByDefault)))
      .toPromise();
  }

  alertsList() {
    return this.http.get<ProjectAlerts>(`${this.url}alerts/`);
  }

  retrieveUserAlertSettings() {
    combineLatest([this.alertsList(), this.projectsService.projects$])
      .pipe(
        map(([projectAlerts, projects]) => {
          if (projects) {
            const projectsWithAlerts = projects.map((project) => {
              const matchingId = Object.keys(projectAlerts).find(
                (element) => parseInt(element, 10) === project.id
              );
              return {
                ...project,
                alertStatus: matchingId ? projectAlerts[matchingId] : -1,
              };
            });
            this.groupProjectsByOrg(projectsWithAlerts);
          }
        })
      )
      .subscribe();
  }

  groupProjectsByOrg(projects: ProjectWithAlertStatus[]) {
    const groupedProjects = projects.reduce(
      (r: GroupedProjects, a: ProjectWithAlertStatus) => {
        r[a.organization.id] = [...(r[a.organization.id] || []), a];
        return r;
      },
      {}
    );
    this.setGroupedProjects(groupedProjects);
  }

  alertsUpdate(projectId: number, status: NotificationStatus) {
    const data: ProjectAlerts = {
      [projectId]: status,
    };
    this.setProjectAlertLoading(projectId);
    return this.http
      .put<ProjectAlerts>(`${this.url}alerts/`, data)
      .pipe(
        tap((_) => {
          this.retrieveUserAlertSettings();
          this.setProjectAlertLoading(null);
        }),
        catchError((error) => {
          if (error) {
            this.setProjectAlertLoading(null);
            this.setProjectAlertError(this.error(error), projectId);
          }
          return EMPTY;
        })
      )
      .toPromise();
  }

  notificationsUpdate(subscribe: boolean) {
    const data = { subscribeByDefault: subscribe };
    this.setSubscribeByDefaultLoading(true);
    return this.http
      .put<SubscribeByDefault>(this.url, data)
      .pipe(
        tap((resp) => {
          this.setSubscribeByDefaultLoading(false);
          this.setSubscribeByDefault(resp.subscribeByDefault);
        }),
        catchError((error) => {
          if (error) {
            this.setSubscribeByDefaultLoading(false);
            this.setSubscribeByDefaultError(this.error(error));
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  error(error: HttpErrorResponse): string {
    return `${error.name}: ${error.statusText}`;
  }

  toggleProjectView() {
    this.setToggleProjectView();
  }

  private setSubscribeByDefault(subscribe: boolean) {
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      subscribeByDefault: subscribe,
    });
  }

  private setToggleProjectView() {
    const projectViewExpanded =
      this.notificationsState.getValue().projectViewExpanded;
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      projectViewExpanded: !projectViewExpanded,
    });
  }

  private setSubscribeByDefaultError(error: string) {
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      subscribeByDefaultError: error,
    });
  }

  private setSubscribeByDefaultLoading(loading: boolean) {
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      subscribeByDefaultLoading: loading,
    });
  }

  private setProjectAlertLoading(projectId: number | null) {
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      projectAlertLoading: projectId,
    });
  }

  private setProjectAlertError(error: string, id: number) {
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      projectAlertError: { error, id },
    });
  }

  private setGroupedProjects(projects: GroupedProjects) {
    this.notificationsState.next({
      ...this.notificationsState.getValue(),
      groupedProjects: projects,
    });
  }
}
