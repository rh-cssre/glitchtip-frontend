import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { NotificationsService } from "./notifications-state";
import { NotificationStatus } from "./notifications.interface";
import { RouterLink } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { KeyValuePipe } from "@angular/common";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";

@Component({
  templateUrl: "./notifications.html",
  styleUrls: ["./notifications.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonToggleModule,
    MatFormFieldModule,
    RouterLink,
    KeyValuePipe,
    ListComponent,
    ListRowComponent,
    SettingsSectionComponent,
  ],
  providers: [NotificationsService],
})
export class Notifications implements OnInit {
  notificationsForLabel = (project: string) =>
    $localize`Alerts for ${project}:project:`;
  private notificationsService = inject(NotificationsService);

  subscribeByDefault = this.notificationsService.subscribeByDefault;
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

  /** What the project actually gets: its own setting, or the default. */
  isOn(status: NotificationStatus) {
    return status === -1 ? this.subscribeByDefault() : status === 1;
  }

  /**
   * Matching the default saves "follow the default" (-1), so the project
   * keeps following it; anything else saves an explicit On or Off.
   */
  setProject(projectId: number, on: boolean) {
    const status: NotificationStatus =
      on === this.subscribeByDefault() ? -1 : on ? 1 : 0;
    this.updateUserAlertSettings(projectId, status);
  }

  updateUserAlertSettings(projectId: number, status: NotificationStatus) {
    this.notificationsService.alertsUpdate(projectId, status);
  }
}
