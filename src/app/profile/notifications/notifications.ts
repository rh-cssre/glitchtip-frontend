import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { NotificationsService } from "./notifications-state";
import { NotificationStatus } from "./notifications.interface";
import { RouterLink } from "@angular/router";
import {
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from "@angular/material/button-toggle";
import { KeyValuePipe } from "@angular/common";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  templateUrl: "./notifications.html",
  styleUrls: ["./notifications.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonToggleModule,
    RouterLink,
    KeyValuePipe,
    ListComponent,
    ListRowComponent,
    SettingsSectionComponent,
    FormErrorComponent,
  ],
  providers: [NotificationsService],
})
export class Notifications implements OnInit {
  notificationsForLabel = (project: string) =>
    $localize`Alerts for ${project}:project:`;
  private notificationsService = inject(NotificationsService);

  subscribeByDefault = this.notificationsService.subscribeByDefault;
  subscribeByDefaultLoaded = this.notificationsService.subscribeByDefaultLoaded;
  subscribeByDefaultLoading =
    this.notificationsService.subscribeByDefaultLoading;
  subscribeByDefaultError = this.notificationsService.subscribeByDefaultError;
  projectAlertLoading = this.notificationsService.projectAlertLoading;
  groupedProjects = this.notificationsService.groupedProjects;
  projectAlertsError = this.notificationsService.projectAlertsError;

  ngOnInit(): void {
    this.notificationsService.subscribeToEndpoints();
  }

  async toggleDefaultNotifications(
    group: MatButtonToggleGroup,
    subscribe: boolean,
  ) {
    if (!(await this.notificationsService.notificationsUpdate(subscribe))) {
      // The bound value never changed, so the group keeps the failed choice.
      group.value = this.subscribeByDefault();
    }
  }

  /** What the project actually gets: its own setting, or the default. */
  isOn(status: NotificationStatus) {
    return status === -1 ? this.subscribeByDefault() : status === 1;
  }

  /**
   * Matching the default saves "follow the default" (-1), so the project
   * keeps following it; anything else saves an explicit On or Off.
   */
  async setProject(
    group: MatButtonToggleGroup,
    projectId: number,
    savedStatus: NotificationStatus,
    on: boolean,
  ) {
    const status: NotificationStatus =
      on === this.subscribeByDefault() ? -1 : on ? 1 : 0;
    if (!(await this.notificationsService.alertsUpdate(projectId, status))) {
      group.value = this.isOn(savedStatus);
    }
  }
}
