import { AfterViewChecked, Component, OnInit, ViewEncapsulation, inject } from "@angular/core";

import { HighlightService } from "../shared/highlight.service";
import { MarkdownComponent } from "ngx-markdown";
import { ActivatedRoute } from "@angular/router";
import { MatCard, MatCardContent } from "@angular/material/card";
import { flattenedPlatforms } from "src/app/settings/projects/platform-picker/platforms-for-picker";

@Component({
  imports: [MarkdownComponent, MatCard, MatCardContent],
  templateUrl: "./sdkdocs.component.html",
  styleUrls: ["./sdkdocs.component.scss"],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SDKDocsComponent implements AfterViewChecked, OnInit {
  private highlightService = inject(HighlightService);
  private route = inject(ActivatedRoute);

  slug: string | null = null;
  title?: string;

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  ngOnInit() {
    const sdk = this.route.snapshot.params.slug;
    this.slug = `/static/sdk-docs/${sdk}.md`;
    this.title = flattenedPlatforms.find(
      (platform) => platform.id === sdk,
    )?.name;
  }
}
