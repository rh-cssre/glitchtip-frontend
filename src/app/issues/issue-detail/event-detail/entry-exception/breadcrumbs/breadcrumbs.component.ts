import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Json } from "src/app/interface-primitives";
import { IssueDetailService } from "../../../issue-detail.service";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  breadcrumbs$ = this.issueDetailService.breadcrumbsExpanded$;
  isExpanded$ = this.issueDetailService.areBreadcrumbsExpanded;
  originalBreadcrumbs$ = this.issueDetailService.breadcrumbs$;

  constructor(private issueDetailService: IssueDetailService) {}

  toggleIsExpanded() {
    this.issueDetailService.getToggleAreBreadcrumbsExpanded();
  }

  originalOrder = (
    a: { [key: string]: Json },
    b: { [key: string]: Json }
  ): number => {
    return 0;
  };
}
