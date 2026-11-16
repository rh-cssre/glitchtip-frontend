import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { DOCS_NAV } from "./docs-nav";

@Component({
  imports: [RouterLink, MatIconModule],
  templateUrl: "./documentation-index.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./documentation-index.component.scss"],
})
export class DocumentationIndexComponent {
  protected readonly nav = DOCS_NAV;
}
