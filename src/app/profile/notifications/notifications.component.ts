import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { NotificationsService } from "./notifications.service";
import { NotificationStatus } from "./notifications.interface";

@Component({
  selector: "gt-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  subscribeByDefault$ = this.notificationsService.subscribeByDefault$;
  projectViewExpanded$ = this.notificationsService.projectViewExpanded$;
  subscribeByDefaultLoading$ = this.notificationsService
    .subscribeByDefaultLoading$;
  subscribeByDefaultError$ = this.notificationsService.subscribeByDefaultError$;
  projectAlertLoading$ = this.notificationsService.projectAlertLoading$;
  groupedProjects$ = this.notificationsService.groupedProjects$;
  projectAlertsError$ = this.notificationsService.projectAlertsError$;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.notificationsService.subscribeToEndpoints();
  }

  toggleDefaultNotifications(subscribe: boolean) {
    this.notificationsService.notificationsUpdate(subscribe);
  }

  toggleProjectView() {
    this.notificationsService.toggleProjectView();
  }

  updateUserAlertSettings(projectId: string, status: NotificationStatus) {
    this.notificationsService.alertsUpdate(projectId, status);
  }
}
