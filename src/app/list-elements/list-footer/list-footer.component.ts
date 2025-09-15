import { Component, Input } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";

@Component({
  selector: "gt-list-footer",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: "./list-footer.component.html",
  styleUrls: ["./list-footer.component.scss"],
})
export class ListFooterComponent {
  @Input() paginator?: {
    loading?: boolean;
    previousPageParams: { [key: string]: string[] } | null;
    hasPreviousPage: boolean;
    nextPageParams: { [key: string]: string[] } | null;
    hasNextPage: boolean;
  };
}
