import { HttpClient } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";
import { SeoService } from "../shared/seo.service";

interface BlogFrontMatter {
  title: string;
  description?: string;
  image?: string;
  date?: string;
}

@Component({
  selector: "app-blog-post",
  imports: [MarkdownComponent, MatCard, MatCardContent],
  templateUrl: "./blog-post.component.html",
  styleUrl: "./blog-post.component.scss",
})
export class BlogPostComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  cleanedMarkdown: string | null = null;
  title: string | null = null;

  ngOnInit() {
    const slug = this.route.snapshot.params.slug;
    const src = `/blog/${slug}.md`;
    this.http.get(src, { responseType: "text" }).subscribe((data) => {
      const { frontMatter, markdown } = this.parseFrontMatter(data);
      this.title = frontMatter.title;
      this.cleanedMarkdown = markdown;
      this.seo.setPageSeo({
        title: frontMatter.title,
        description: frontMatter.description,
        image: frontMatter.image,
        type: "article",
        publishedTime: frontMatter.date || this.dateFromSlug(slug),
      });
    });
  }

  private parseFrontMatter(raw: string): {
    frontMatter: BlogFrontMatter;
    markdown: string;
  } {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) {
      return { frontMatter: { title: "" }, markdown: raw };
    }
    const body = raw.slice(match[0].length);
    const fields: Record<string, string> = {};
    for (const line of match[1].split("\n")) {
      const kv = line.match(/^(\w+):\s*"?([^"]*?)"?\s*$/);
      if (kv) fields[kv[1]] = kv[2];
    }
    return {
      frontMatter: {
        title: fields.title || "",
        description: fields.description || undefined,
        image: fields.image || undefined,
        date: fields.date || undefined,
      },
      markdown: body,
    };
  }

  private dateFromSlug(slug: string): string | undefined {
    const match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : undefined;
  }
}
