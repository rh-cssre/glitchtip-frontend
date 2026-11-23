import {
  Component,
  ViewEncapsulation,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { PageShellComponent } from "../shared/page-shell/page-shell.component";
import { ActivatedRoute } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";

@Component({
  imports: [PageShellComponent, MarkdownComponent],
  templateUrl: "./legal.component.html",
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.Emulated,
})
export class LegalComponent {
  private route = inject(ActivatedRoute);

  slug: string | null = null;

  ngOnInit(): void {
    this.slug = `/legal/${this.route.snapshot.params.slug}.md`;
  }
}
