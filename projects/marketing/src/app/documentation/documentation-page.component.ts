import { Component, OnInit } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent, MarkdownService } from "ngx-markdown";

@Component({
  standalone: true,
  imports: [MatCard, MatCardContent, RouterLink, MarkdownComponent],
  templateUrl: "./documentation-page.component.html",
  styleUrls: ["./documentation-page.component.scss"],
})
export class DocumentationPageComponent implements OnInit {
  slug: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private markdownService: MarkdownService,
  ) {}

  ngOnInit(): void {
    const locationPrefix = `/documentation/${this.route.snapshot.params.slug}`;

    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
      return (
        `<h${level}>` +
        `<a id="${escapedText}" class="anchor" href="${locationPrefix}#${escapedText}">` +
        text +
        "</a>" +
        `</h${level}>`
      );
    };

    this.slug = locationPrefix + ".md";
  }
}
