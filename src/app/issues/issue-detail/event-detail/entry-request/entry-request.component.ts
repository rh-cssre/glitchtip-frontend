import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { KeyValuePipe } from "@angular/common";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { PrismDirective } from "../../../../prismjs/prism.directive";

@Component({
  selector: "gt-entry-request",
  templateUrl: "./entry-request.component.html",
  styleUrls: ["./entry-request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    MatTooltipModule,
    EntryDataComponent,
    KeyValuePipe,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
    PrismDirective,
  ],
})
export class EntryRequestComponent {
  private issueService = inject(IssueDetailService);
  viewMode = signal<"structured" | "raw">("structured");
  copied = signal(false);

  eventEntryRequest = this.issueService.eventEntryRequest;
  rawBody = computed(() => {
    const data = this.eventEntryRequest()?.data;
    if (data) {
      try {
        return JSON.stringify(data, null, 2);
      } catch (err) {
        //ignore
      }
    }
    return null;
  });

  /**
   * Set copy icon to show it was copied, then reset state
   */
  copy() {
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 4000);
  }
}
