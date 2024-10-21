import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { isStacktrace } from "src/app/issues/utils";
import { RawStacktraceComponent } from "./raw-stacktrace/raw-stacktrace.component";
import { FrameExpandedComponent } from "./frame-expanded/frame-expanded.component";
import { FrameTitleComponent } from "./frame-title/frame-title.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-entry-exception",
  templateUrl: "./entry-exception.component.html",
  styleUrls: ["./entry-exception.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatExpansionModule,
    FrameTitleComponent,
    FrameExpandedComponent,
    RawStacktraceComponent,
    AsyncPipe
],
})
export class EntryExceptionComponent {
  @Input() eventTitle: string | undefined;
  @Input() eventPlatform: string | undefined;
  eventEntryException$ = this.issueService.eventEntryException$;
  isReversed$ = this.issueService.isReversed$;

  constructor(private issueService: IssueDetailService) {}

  checkStacktraceInterface = isStacktrace;

  getFlippedFrames() {
    this.issueService.getReversedFrames();
  }
}
