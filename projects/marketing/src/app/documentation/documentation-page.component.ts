import { Component, OnInit, inject } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent, MarkdownService } from "ngx-markdown";

@Component({
  imports: [MatCard, MatCardContent, RouterLink, MarkdownComponent],
  templateUrl: "./documentation-page.component.html",
  styleUrls: ["./documentation-page.component.scss"],
})
export class DocumentationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private markdownService = inject(MarkdownService);

  slug: string | null = null;

  ngOnInit(): void {
    const locationPrefix = `/documentation/${this.route.snapshot.params.slug}`;

    this.markdownService.renderer.heading = ({ text, depth }) => {
      const escapedText = text
        .toLowerCase()
        // replace non-letter characters with hyphens
        .replace(/[^\w]+/g, "-")
        //trim hyphens at end of string
        .replace(/\-$/, "");
      return (
        `<h${depth}>` +
        `<a id="${escapedText}" class="anchor" href="${locationPrefix}#${escapedText}">` +
        text +
        "</a>" +
        `</h${depth}>`
      );
    };

    this.slug = locationPrefix + ".md";
  }
}
