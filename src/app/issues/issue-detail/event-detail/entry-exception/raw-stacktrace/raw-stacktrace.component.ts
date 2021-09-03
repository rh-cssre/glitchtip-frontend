import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { isStacktrace } from "src/app/issues/utils";
import { IssueDetailService } from "../../../issue-detail.service";

@Component({
  selector: "gt-raw-stacktrace",
  templateUrl: "./raw-stacktrace.component.html",
  styleUrls: ["./raw-stacktrace.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawStacktraceComponent {
  @Input() eventPlatform: string | null | undefined;
  rawStacktraceValues$ = this.issueService.rawStacktraceValues$;

  constructor(private issueService: IssueDetailService) {}

  checkStacktraceInterface = isStacktrace;
}
