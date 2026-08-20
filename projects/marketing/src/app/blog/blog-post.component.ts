import { DatePipe, ViewportScroller, isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  ElementRef,
  PLATFORM_ID,
  DestroyRef,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PageShellComponent } from "../shared/page-shell/page-shell.component";
import { addCodeCopyButtons } from "../shared/code-copy";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent } from "ngx-markdown";
import { SeoService } from "../shared/seo.service";
import { HighlightService } from "../shared/highlight.service";

interface BlogFrontMatter {
  title: string;
  description?: string;
  image?: string;
  date?: string;
}

interface BlogRef {
  title: string;
  route: string;
  date?: string;
  description?: string;
}

@Component({
  selector: "app-blog-post",
  imports: [MarkdownComponent, PageShellComponent, RouterLink, DatePipe],
  templateUrl: "./blog-post.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./blog-post.component.scss",
})
export class BlogPostComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private highlight = inject(HighlightService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private viewportScroller = inject(ViewportScroller);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  protected readonly title = signal<string | null>(null);
  protected readonly cleanedMarkdown = signal<string | null>(null);
  protected readonly postDate = signal<string | null>(null);

  private readonly slug = signal("");
  private readonly index = signal<BlogRef[] | null>(null);

  /**
   * Neighbours in the newest-first manifest: the entry before the current post
   * is newer, the one after is older. Drives the post pager.
   */
  private readonly currentIndex = computed(() => {
    const list = this.index();
    const s = this.slug();
    if (!list || !s) {
      return -1;
    }
    return list.findIndex((p) => p.route.replace(/^\/blog\//, "") === s);
  });

  protected readonly newerPost = computed<BlogRef | null>(() => {
    const i = this.currentIndex();
    return i > 0 ? (this.index()?.[i - 1] ?? null) : null;
  });

  protected readonly olderPost = computed<BlogRef | null>(() => {
    const list = this.index();
    const i = this.currentIndex();
    return list && i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  });

  ngOnInit(): void {
    this.http
      .get<BlogRef[]>("/blog/blogIndex.json")
      .subscribe((data) => this.index.set(data));

    // React to slug changes: the router reuses this component when navigating
    // between posts (via the pager), so a one-shot snapshot read would go stale.
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const slug = params.get("slug") ?? "";
        this.slug.set(slug);
        this.title.set(null);
        this.cleanedMarkdown.set(null);
        this.viewportScroller.scrollToPosition([0, 0]);
        this.http
          .get(`/blog/${slug}.md`, { responseType: "text" })
          .subscribe((data) => {
            const { frontMatter, markdown } = this.parseFrontMatter(data);
            const date = frontMatter.date || this.dateFromSlug(slug) || null;
            this.title.set(frontMatter.title);
            this.postDate.set(date);
            this.cleanedMarkdown.set(markdown);
            this.seo.setPageSeo({
              title: frontMatter.title,
              description: frontMatter.description,
              image: frontMatter.image,
              type: "article",
              publishedTime: date ?? undefined,
            });
          });
      });
  }

  onReady(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.highlight.highlightAll();
    addCodeCopyButtons(this.host.nativeElement);
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
