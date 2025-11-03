import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { NotificationsService } from "./notifications-state";
import { NotificationStatus } from "./notifications.interface";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { KeyValuePipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";

@Component({
  templateUrl: "./notifications.html",
  styleUrls: ["./notifications.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    KeyValuePipe,
  ],
  providers: [NotificationsService],
})
export class Notifications implements OnInit {
  private notificationsService = inject(NotificationsService);

  subscribeByDefault = this.notificationsService.subscribeByDefault;
  projectViewExpanded = this.notificationsService.projectViewExpanded;
  subscribeByDefaultLoading =
    this.notificationsService.subscribeByDefaultLoading;
  subscribeByDefaultError = this.notificationsService.subscribeByDefaultError;
  projectAlertLoading = this.notificationsService.projectAlertLoading;
  groupedProjects = this.notificationsService.groupedProjects;
  projectAlertsError = this.notificationsService.projectAlertsError;

  ngOnInit(): void {
    this.notificationsService.subscribeToEndpoints();
  }

  toggleDefaultNotifications(subscribe: boolean) {
    this.notificationsService.notificationsUpdate(subscribe);
  }

  toggleProjectView() {
    this.notificationsService.toggleProjectView();
  }

  updateUserAlertSettings(projectId: number, status: NotificationStatus) {
    this.notificationsService.alertsUpdate(projectId, status);
  }
}
