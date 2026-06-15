import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";

import { HighlightService } from "../shared/highlight.service";
import { SeoService } from "../shared/seo.service";
import { MarkdownComponent } from "ngx-markdown";
import { ActivatedRoute } from "@angular/router";
import { MatCard, MatCardContent } from "@angular/material/card";
import { flattenedPlatforms } from "src/app/settings/projects/new-project/platform-picker/platforms-for-picker";

@Component({
  imports: [MarkdownComponent, MatCard, MatCardContent],
  templateUrl: "./sdkdocs.component.html",
  styleUrls: ["./sdkdocs.component.scss"],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SDKDocsComponent implements AfterViewChecked, OnInit {
  private highlightService = inject(HighlightService);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

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
    if (this.title) {
      this.seo.setPageSeo({
        title: `${this.title} SDK`,
        description: `Set up the ${this.title} SDK to send errors and performance data to GlitchTip.`,
      });
    }
  }
}
