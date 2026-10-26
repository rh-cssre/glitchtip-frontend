import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";

@Component({
  selector: "gt-pagination-buttons",
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: "./pagination-buttons.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./pagination-buttons.scss"],
})
export class PaginationButtons {
  @Input() paginator?: {
    previousPageParams: { [key: string]: string[] } | null;
    hasPreviousPage: boolean;
    nextPageParams: { [key: string]: string[] } | null;
    hasNextPage: boolean;
  };
  @Input() loading?: boolean;
  /**
   * Whether the request finished, successfully or not. An errored list has no
   * paginator, so without this the buttons spin forever on a failed load.
   */
  @Input() settled?: boolean;
}
