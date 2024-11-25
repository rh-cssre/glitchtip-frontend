import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: "app-blog-post",
  standalone: true,
  imports: [MarkdownComponent, MatCard, MatCardContent],
  templateUrl: "./blog-post.component.html",
  styleUrl: "./blog-post.component.scss",
})
export class BlogPostComponent implements OnInit {
  cleanedMarkdown: string | null = null;
  title: string | null = null;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const src = `/blog/${this.route.snapshot.params.slug}.md`;
    this.http.get(src, { responseType: "text" }).subscribe((data) => {
      const { title, markdown } = this.parseFrontMatter(data);
      this.title = title;
      this.cleanedMarkdown = markdown;
    });
  }

  parseFrontMatter(markdown: string): { title: string; markdown: string } {
    const frontMatterRegex = /---[\s\S]*?---/;
    const match = markdown.match(frontMatterRegex);

    let title = "";
    let content = markdown;

    if (match) {
      const frontMatter = match[0];
      content = markdown.replace(frontMatterRegex, "").trim();

      const titleMatch = frontMatter.match(/title:\s*['"]?([^'"]+)['"]?/);
      if (titleMatch) {
        title = titleMatch[1];
      }
    }

    return { title, markdown: content };
  }
}
