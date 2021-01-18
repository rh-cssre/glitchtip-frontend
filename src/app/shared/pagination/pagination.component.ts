import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() previousPageParams: {
    [key: string]: string;
  } | null = null;
  @Input() hasPreviousPage = false;
  @Input() nextPageParams: {
    [key: string]: string;
  } | null = null;
  @Input() hasNextPage = false;

  constructor() {}
}
