import { Component, ChangeDetectionStrategy, input, inject } from "@angular/core";
import { isStacktrace } from "src/app/issues/utils";
import { IssueDetailService } from "../../../issue-detail.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-raw-stacktrace",
  templateUrl: "./raw-stacktrace.component.html",
  styleUrls: ["./raw-stacktrace.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class RawStacktraceComponent {
  private issueService = inject(IssueDetailService);

  readonly eventPlatform = input<string | null>();
  rawStacktraceValues$ = this.issueService.rawStacktraceValues$;

  checkStacktraceInterface = isStacktrace;
}
