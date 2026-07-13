import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { platforms } from "src/app/settings/projects/new-project/platform-picker/platforms";

@Component({
  templateUrl: "./sdkdocs-index.component.html",
  imports: [RouterLink, MatCard, MatCardContent],
  styles: [
    `
      .unstyled {
        list-style: none;
        padding: 0;
      }
    `,
  ],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SDKDocsIndexComponent {
  platforms = platforms;
  constructor() {}
}
