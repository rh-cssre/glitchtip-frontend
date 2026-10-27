import {
  Component,
  OnInit,
  inject,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { MonitorFormComponent } from "../monitor-form/monitor-form.component";
import { MonitorInput } from "../uptime.interfaces";
import { MonitorService, MonitorState } from "../monitor.service";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterModule,
    MonitorFormComponent,
    PageHeaderComponent,
    BackLinkComponent,
    TopAppBar,
    SettingsSectionComponent,
    LoadingButtonComponent,
    FormErrorComponent,
  ],
})
export class MonitorUpdateComponent
  extends StatefulComponent<MonitorState, MonitorService>
  implements OnInit
{
  private dialog = inject(MatDialog);

  protected service: MonitorService;
  monitorID = input.required<number>({ alias: "monitor-id" });

  monitor = this.service.activeMonitor;
  loading = this.service.editLoading;
  error = this.service.error;
  deleteLoading = this.service.deleteLoading;
  deleteError = this.service.deleteError;
  canWriteProject = inject(OrganizationsService).canWriteProject;

  constructor() {
    const service = inject(MonitorService);
    super(service);
    this.service = service;
  }

  ngOnInit() {
    this.service.retrieveMonitorDetails(this.monitorID());
  }

  submit(formValues: MonitorInput) {
    this.service.editMonitor(formValues);
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete ${this.monitor()?.name ?? ""}:name:?`,
        message: $localize`Its check history is deleted too. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.deleteMonitor();
      }
    });
  }
}
