import { Component, ViewEncapsulation, inject } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";

@Component({
  imports: [MatCard, MatCardContent, MarkdownComponent],
  templateUrl: "./legal.component.html",
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class LegalComponent {
  private route = inject(ActivatedRoute);

  slug: string | null = null;

  ngOnInit(): void {
    this.slug = `/legal/${this.route.snapshot.params.slug}.md`;
  }
}
