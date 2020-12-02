import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Json } from "src/app/interface-primitives";
import { BreadcrumbsService } from "./breadcrumbs.service";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
  isExpanded$ = this.breadcrumbsService.isExpanded;

  constructor(private breadcrumbsService: BreadcrumbsService) {}

  toggleIsExpanded() {
    this.breadcrumbsService.toggleExpand();
  }

  originalOrder = (
    a: { [key: string]: Json },
    b: { [key: string]: Json }
  ): number => {
    return 0;
  };
}
