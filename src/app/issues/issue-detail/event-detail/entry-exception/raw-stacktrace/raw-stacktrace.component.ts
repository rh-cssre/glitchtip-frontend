import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IssueDetailService } from "../../../issue-detail.service";

@Component({
  selector: "app-raw-stacktrace",
  templateUrl: "./raw-stacktrace.component.html",
  styleUrls: ["./raw-stacktrace.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawStacktraceComponent {
  @Input() eventPlatform: string | null | undefined;
  rawStacktraceValues$ = this.issueService.rawStacktraceValues$;

  constructor(private issueService: IssueDetailService) {}
}
