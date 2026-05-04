import { Component, OnInit, inject } from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { SeoService } from "../shared/seo.service";

@Component({
  imports: [MatCard, MatCardContent, RouterLink, MarkdownComponent],
  templateUrl: "./documentation-page.component.html",
  styleUrls: ["./documentation-page.component.scss"],
})
export class DocumentationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private markdownService = inject(MarkdownService);
  private viewportScroller = inject(ViewportScroller);
  private seo = inject(SeoService);

  slug: string | null = null;

  ngOnInit(): void {
    const pageSlug: string = this.route.snapshot.params.slug;
    const locationPrefix = `/documentation/${pageSlug}`;
    this.seo.setPageSeo({
      title: `${this.titleFromSlug(pageSlug)} — Documentation`,
    });

    this.markdownService.renderer.heading = ({ text, depth }) => {
      const escapedText = text
        .toLowerCase()
        // replace non-letter characters with hyphens
        .replace(/[^\w]+/g, "-")
        //trim hyphens at start and end of string
        .replace(/^-+|-+$/g, "");
      return (
        `<h${depth} class="anchor">` +
        `<a id="${escapedText}" href="${locationPrefix}#${escapedText}">` +
        text +
        "</a>" +
        `</h${depth}>`
      );
    };

    this.slug = locationPrefix + ".md";
  }

  onMarkdownReady() {
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      this.viewportScroller.scrollToAnchor(fragment);
    }
  }

  private titleFromSlug(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
