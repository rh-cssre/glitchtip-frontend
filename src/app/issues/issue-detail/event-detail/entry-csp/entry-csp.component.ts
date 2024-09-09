import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { AsyncPipe, JsonPipe, KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-entry-csp",
  templateUrl: "./entry-csp.component.html",
  styleUrls: ["./entry-csp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDividerModule,
    MatButtonToggleModule,
    EntryDataComponent,
    AsyncPipe,
    JsonPipe,
    KeyValuePipe
],
})
export class EntryCSPComponent {
  eventEntryCSP$ = this.issueService.eventEntryCSP$;

  constructor(private issueService: IssueDetailService) {}
}
