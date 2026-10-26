import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { JsonPipe, KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-entry-csp",
  templateUrl: "./entry-csp.component.html",
  styleUrls: ["./entry-csp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    MatButtonToggleModule,
    EntryDataComponent,
    JsonPipe,
    KeyValuePipe,
  ],
})
export class EntryCSPComponent {
  private issueService = inject(IssueDetailService);

  eventEntryCSP = this.issueService.eventEntryCSP;
}
