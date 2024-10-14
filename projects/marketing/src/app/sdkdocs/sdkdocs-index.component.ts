import { Component, ViewEncapsulation } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { platforms } from "src/app/settings/projects/platform-picker/platforms";

// const SDK_DOCS_ROUTE = "/sdkdocs/";
// const sdkBlacklist = [
//   "all-sdks.md", // Not an actual SDK doc
//   "other.md", // Ditto
// ];

@Component({
  templateUrl: "./sdkdocs-index.component.html",
  standalone: true,
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
  encapsulation: ViewEncapsulation.Emulated,
})
export class SDKDocsIndexComponent {
  platforms = platforms;
  constructor() {}
}
