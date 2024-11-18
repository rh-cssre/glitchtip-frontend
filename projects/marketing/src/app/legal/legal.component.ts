import { Component, ViewEncapsulation } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";

@Component({
  standalone: true,
  imports: [MatCard, MatCardContent, MarkdownComponent],
  templateUrl: "./legal.component.html",
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class LegalComponent {
  slug: string | null = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug = `/legal/${this.route.snapshot.params.slug}.md`;
  }
}
