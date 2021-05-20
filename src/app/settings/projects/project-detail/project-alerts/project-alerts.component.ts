import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { ProjectAlertsService } from "./project-alerts.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

@Component({
  selector: "app-project-alerts",
  templateUrl: "./project-alerts-new.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAlertsComponent implements OnInit, OnDestroy {
  projectAlerts$ = this.alertsService.projectAlert$;
  alertToggleLoading$ = this.alertsService.alertToggleLoading$;
  alertToggleError$ = this.alertsService.alertToggleError$;
  initialLoad$ = this.alertsService.initialLoad$;
  loading$ = this.alertsService.loading$;
  error$ = this.alertsService.error$;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(private alertsService: ProjectAlertsService) {}

  ngOnInit(): void {
    this.alertsService.listProjectAlerts();
  }

  ngOnDestroy() {
    this.alertsService.clearState();
  }

  // onSubmit() {
  //   if (this.projectAlertForm.valid) {
  //     const timespan = this.projectAlertForm.get("timespan_minutes")?.value;
  //     const quantity = this.projectAlertForm.get("quantity")?.value;
  //     // TODO: replace placeholder for recipients with real data
  //     const recipients: AlertRecipient[] = [
  //       { pk: 0, recipientType: "email", url: "" },
  //     ];
  //     console.log(`Submit data: ${timespan}, ${quantity}, and ${recipients}`);
  //     // this.alertsService.updateProjectAlerts(timespan, quantity, recipients);
  //   }
  // }
}
