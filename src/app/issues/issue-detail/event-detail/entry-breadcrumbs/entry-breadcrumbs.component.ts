import { KeyValue, NgClass, AsyncPipe, JsonPipe, DatePipe, KeyValuePipe } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Json } from "src/app/interface-primitives";
import { IssueDetailService } from "../../issue-detail.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "gt-entry-breadcrumbs",
  templateUrl: "./entry-breadcrumbs.component.html",
  styleUrls: ["./entry-breadcrumbs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDividerModule,
    NgClass,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    JsonPipe,
    DatePipe,
    KeyValuePipe
],
})
export class EntryBreadcrumbsComponent implements AfterViewInit {
  @ViewChild("breadBox") breadBox?: ElementRef;

  breadcrumbs$ = this.issueDetailService.breadcrumbs$;
  showShowMore$ = this.issueDetailService.showShowMore$;

  constructor(private issueDetailService: IssueDetailService) {}

  ngAfterViewInit() {
    if (this.breadBox?.nativeElement.offsetHeight >= 1250) {
      setTimeout(() => this.issueDetailService.setShowShowMore(true));
    }
  }

  expandBreadcrumbs() {
    this.issueDetailService.setShowShowMore(false);
  }

  keepOrder = (
    a: KeyValue<string, Json>,
    b: KeyValue<string, Json>
  ): number => {
    return 0;
  };
}
