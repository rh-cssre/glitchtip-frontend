import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { LinksService } from "../links.service";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";

@Component({
  imports: [RouterLink, MatCardModule],
  templateUrl: "./documentation-index.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./documentation-index.component.scss"],
})
export class DocumentationIndexComponent {
  private links = inject(LinksService);

  registerLink = this.links.registerLink;
}
