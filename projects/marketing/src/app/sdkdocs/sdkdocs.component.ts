import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";

import { HighlightService } from "../shared/highlight.service";
import { MarkdownComponent } from "ngx-markdown";
import { ActivatedRoute } from "@angular/router";
import { MatCard, MatCardContent } from "@angular/material/card";
import { flattenedPlatforms } from "src/app/settings/projects/platform-picker/platforms-for-picker";

@Component({
  standalone: true,
  imports: [MarkdownComponent, MatCard, MatCardContent],
  templateUrl: "./sdkdocs.component.html",
  styleUrls: ["./sdkdocs.component.scss"],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SDKDocsComponent implements AfterViewChecked, OnInit {
  slug: string | null = null;
  title?: string;
  constructor(
    private highlightService: HighlightService,
    private route: ActivatedRoute,
  ) {}

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
