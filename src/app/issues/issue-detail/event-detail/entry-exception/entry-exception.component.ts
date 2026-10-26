import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
} from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { isStacktrace } from "src/app/issues/utils";
import { RawStacktraceComponent } from "./raw-stacktrace/raw-stacktrace.component";
import { FrameExpandedComponent } from "./frame-expanded/frame-expanded.component";
import { FrameTitleComponent } from "./frame-title/frame-title.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "gt-entry-exception",
  templateUrl: "./entry-exception.component.html",
  styleUrls: ["./entry-exception.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatExpansionModule,
    FrameTitleComponent,
    FrameExpandedComponent,
    RawStacktraceComponent,
  ],
})
export class EntryExceptionComponent {
  private issueService = inject(IssueDetailService);

  readonly eventTitle = input<string>();
  readonly eventPlatform = input<string>();
  eventEntryException = this.issueService.eventEntryException;
  isReversed = this.issueService.isReversed;

  checkStacktraceInterface = isStacktrace;

  getFlippedFrames() {
    this.issueService.getReversedFrames();
  }
}
