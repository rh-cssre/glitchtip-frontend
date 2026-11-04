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
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
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
    ListRowLinkComponent,
    EmptyStateComponent,
    SettingsSectionComponent,
    FormErrorComponent,
  ],
  providers: [NotificationsService],
})
export class Notifications implements OnInit {
  notificationsForLabel = (project: string) =>
    $localize`Alerts for ${project}:project:`;
  onText = $localize`On`;
  offText = $localize`Off`;
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

  /** Saves -1 (follow the default), 1 (on) or 0 (off). */
  async setProject(
    group: MatButtonToggleGroup,
    projectId: number,
    savedStatus: NotificationStatus,
    status: NotificationStatus,
  ) {
    if (!(await this.notificationsService.alertsUpdate(projectId, status))) {
      group.value = savedStatus;
    }
  }
}
