import { Component, Input } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";
import { Paginator } from "src/app/shared/stateful-service/pagination-stateful-service";

@Component({
  standalone: true,
  selector: "gt-list-footer",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
],
  templateUrl: "./list-footer.component.html",
  styleUrls: ["./list-footer.component.scss"],
})
export class ListFooterComponent {
  @Input() paginator?: Paginator;
}
