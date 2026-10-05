import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from "@angular/core";
import { PageShellComponent } from "../shared/page-shell/page-shell.component";
import { RevealDirective } from "../shared/reveal.directive";
import { RouterLink } from "@angular/router";

interface BlogItem {
  title: string;
  route: string;
  date?: string;
  description?: string;
}

interface YearGroup {
  year: number;
  posts: BlogItem[];
}

@Component({
  selector: "app-blog-index",
  imports: [RouterLink, PageShellComponent, RevealDirective, DatePipe],
  templateUrl: "./blog-index.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./blog-index.component.scss",
})
export class BlogIndexComponent implements OnInit {
  private http = inject(HttpClient);

  protected readonly posts = signal<BlogItem[] | null>(null);

  /** The newest post gets a prominent featured treatment. */
  protected readonly featured = computed(() => this.posts()?.[0] ?? null);

  /**
   * The remaining posts, grouped by year for a scannable archive. The manifest
   * is already newest-first, so a single pass keeps years in descending order.
   */
  protected readonly groupedByYear = computed<YearGroup[]>(() => {
    const all = this.posts();
    if (!all) {
      return [];
    }
    const groups: YearGroup[] = [];
    for (const post of all.slice(1)) {
      const year = post.date ? new Date(post.date).getFullYear() : 0;
      const current = groups[groups.length - 1];
      if (!current || current.year !== year) {
        groups.push({ year, posts: [post] });
      } else {
        current.posts.push(post);
      }
    }
    return groups;
  });

  ngOnInit(): void {
    this.http
      .get<BlogItem[]>("/blog/blogIndex.json")
      .subscribe((data) => this.posts.set(data));
  }
}
