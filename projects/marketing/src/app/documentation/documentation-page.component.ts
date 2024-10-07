import { Component, OnInit } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";

@Component({
  standalone: true,
  imports: [MatCard, MatCardContent, RouterLink, MarkdownComponent],
  templateUrl: "./documentation-page.component.html",
  styleUrls: ["./documentation-page.component.scss"],
})
export class DocumentationPageComponent implements OnInit {
  slug: string | null = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug = `/documentation/${this.route.snapshot.params.slug}.md`;
  }
}
