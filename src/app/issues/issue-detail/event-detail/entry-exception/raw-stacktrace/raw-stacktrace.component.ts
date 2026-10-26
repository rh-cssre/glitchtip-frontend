import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
} from "@angular/core";
import { isStacktrace } from "src/app/issues/utils";
import { IssueDetailService } from "../../../issue-detail.service";

@Component({
  selector: "gt-raw-stacktrace",
  templateUrl: "./raw-stacktrace.component.html",
  styleUrls: ["./raw-stacktrace.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawStacktraceComponent {
  private issueService = inject(IssueDetailService);

  readonly eventPlatform = input<string | null>();
  rawStacktraceValues = this.issueService.rawStacktraceValues;

  checkStacktraceInterface = isStacktrace;
}
