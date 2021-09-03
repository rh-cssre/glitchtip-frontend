import { KeyValue } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Json } from "src/app/interface-primitives";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "gt-entry-breadcrumbs",
  templateUrl: "./entry-breadcrumbs.component.html",
  styleUrls: ["./entry-breadcrumbs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
