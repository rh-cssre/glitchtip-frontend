import {
  Component,
  OnInit,
  ElementRef,
  PLATFORM_ID,
  DestroyRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isPlatformBrowser } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { SeoService } from "../shared/seo.service";
import { HighlightService } from "../shared/highlight.service";
import { addCodeCopyButtons } from "../shared/code-copy";
import { DOC_ORDER } from "./docs-nav";

/**
 * Placeholder host used throughout the docs' example snippets. When a reader
 * arrives from an in-app "Set up MCP" link, the real instance origin is passed
 * in the URL fragment and swapped in here so the examples are paste-ready.
 */
const INSTANCE_PLACEHOLDER = "https://your-glitchtip.example.com";

/**
 * A normal public DNS hostname: dot-separated LDH labels (each starting and
 * ending alphanumeric, ≤63 chars) and an alphabetic TLD. Deliberately rejects
 * IP literals, `localhost`, single-label/internal hosts, and trailing-dot
 * FQDNs. Note: a *valid* hostname can still be attacker-chosen — this only
 * guarantees the shape, see parseInstanceOrigin().
 */
const STRICT_HOSTNAME = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/**
 * Sticky top-app-bar height: anchored headings land this far below the viewport
 * top. Kept in sync with `scroll-padding-top` in styles.scss.
 */
const ANCHOR_OFFSET = 88;

/**
 * A heading becomes the "current" TOC entry once its top passes just below the
 * landing line, so a heading you just clicked to reads as active immediately.
 */
const ACTIVE_LINE = ANCHOR_OFFSET + 8;

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface DocRef {
  slug: string;
  title: string;
}

@Component({
  imports: [RouterLink, MarkdownComponent],
  templateUrl: "./documentation-page.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./documentation-page.component.scss"],
})
export class DocumentationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private markdownService = inject(MarkdownService);
  private seo = inject(SeoService);
  private highlight = inject(HighlightService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  protected readonly src = signal<string | null>(null);
  protected readonly toc = signal<TocItem[]>([]);
  protected readonly activeId = signal<string | null>(null);
  protected readonly prevDoc = signal<DocRef | null>(null);
  protected readonly nextDoc = signal<DocRef | null>(null);
  protected readonly pageSlug = signal("");

  /** Current page's heading anchors, in document order (refreshed per slug). */
  private headings: HTMLElement[] = [];
  private scrollListenerBound = false;

  ngOnInit(): void {
    // Add stable anchor ids + self-links to every heading (used by the TOC and
    // for #fragment deep links). References currentSlug so it stays correct as
    // the reader navigates between docs (the component is reused across slugs).
    this.markdownService.renderer.heading = ({ text, depth }) => {
      const id = this.slugify(text);
      return (
        `<h${depth} class="anchor">` +
        `<a id="${id}" href="/documentation/${this.pageSlug()}#${id}">` +
        text +
        "</a></h" +
        depth +
        ">"
      );
    };

    // Re-render on slug changes (sidebar navigation reuses this component, so a
    // one-shot snapshot read in ngOnInit would leave the content stale).
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const slug = params.get("slug") ?? "";
        this.pageSlug.set(slug);
        this.toc.set([]);
        this.activeId.set(null);
        this.headings = [];
        this.seo.setPageSeo({
          title: `${this.titleFromSlug(slug)} — Documentation`,
        });
        this.setPager(slug);
        this.src.set(`/documentation/${slug}.md`);
      });
  }

  onMarkdownReady(): void {
    this.fillInstancePlaceholder();
    if (isPlatformBrowser(this.platformId)) {
      this.highlight.highlightAll();
      addCodeCopyButtons(this.host.nativeElement);
      this.buildToc();
      this.setupScrollSpy();

      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        // Native scrolling respects `scroll-padding-top`, so a deep-linked
        // heading lands below the sticky toolbar instead of behind it.
        document.getElementById(fragment)?.scrollIntoView({ block: "start" });
      }
    }
  }

  protected onTocClick(event: Event, id: string): void {
    event.preventDefault();
    this.activeId.set(id);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
    history.replaceState(null, "", `/documentation/${this.pageSlug()}#${id}`);
  }

  private setPager(slug: string): void {
    const index = DOC_ORDER.findIndex((doc) => doc.slug === slug);
    this.prevDoc.set(index > 0 ? DOC_ORDER[index - 1] : null);
    this.nextDoc.set(
      index >= 0 && index < DOC_ORDER.length - 1 ? DOC_ORDER[index + 1] : null,
    );
  }

  private buildToc(): void {
    const headings = this.host.nativeElement.querySelectorAll<HTMLElement>(
      ".markdown-container h2 a[id], .markdown-container h3 a[id]",
    );
    const items: TocItem[] = Array.from(headings).map((anchor) => ({
      id: anchor.id,
      text: anchor.textContent ?? "",
      depth: anchor.parentElement?.tagName === "H3" ? 3 : 2,
    }));
    this.toc.set(items);
  }

  /**
   * Highlight the TOC entry for the section currently under the header. Uses a
   * scroll-position read (not an IntersectionObserver band) so it is
   * deterministic and, crucially, so the last item can still become active when
   * the final section is too short to scroll into a band.
   */
  private setupScrollSpy(): void {
    this.headings = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>(
        ".markdown-container h2 a[id], .markdown-container h3 a[id]",
      ),
    );
    if (!this.headings.length) {
      this.activeId.set(null);
      return;
    }

    // The scroll/resize listener persists across slug changes (headings are
    // refreshed above); bind it once and clean it up with the component.
    if (!this.scrollListenerBound) {
      this.scrollListenerBound = true;
      let ticking = false;
      const onScroll = () => {
        if (ticking) {
          return;
        }
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          this.updateActiveHeading();
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      });
    }

    this.updateActiveHeading();
  }

  private updateActiveHeading(): void {
    if (!this.headings.length) {
      return;
    }

    // At the bottom of the page the last section is current even if it never
    // reaches the active line (short final sections).
    const atBottom =
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 2;
    if (atBottom) {
      this.activeId.set(this.headings[this.headings.length - 1].id);
      return;
    }

    // Otherwise the active heading is the last one whose top has passed just
    // below the header; default to the first before any have.
    let active = this.headings[0];
    for (const heading of this.headings) {
      if (heading.getBoundingClientRect().top <= ACTIVE_LINE) {
        active = heading;
      } else {
        break;
      }
    }
    this.activeId.set(active.id);
  }


  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /**
   * If the URL fragment carries an `instance` origin (e.g.
   * `#instance=https://errors.acme.com`), replace the placeholder host in the
   * rendered example snippets with it. Fragments are read client-side only and
   * never sent to this server, so a self-hoster's instance domain isn't logged
   * here. The value is validated as an http(s) origin and written via
   * textContent, so it can't inject markup.
   */
  private fillInstancePlaceholder(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const fragment = this.route.snapshot.fragment;
    if (!fragment) {
      return;
    }
    const origin = this.parseInstanceOrigin(
      new URLSearchParams(fragment).get("instance"),
    );
    if (!origin) {
      return;
    }
    const root: HTMLElement | null = this.host.nativeElement.querySelector(
      ".markdown-container",
    );
    if (!root) {
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes(INSTANCE_PLACEHOLDER)) {
        node.nodeValue = node.nodeValue
          .split(INSTANCE_PLACEHOLDER)
          .join(origin);
      }
    }
  }

  /**
   * Turn the `instance` fragment value into a trusted origin to show in the
   * examples, or null (→ leave the generic placeholder) for anything we don't
   * fully trust. A docs link is attacker-supplyable, so we fail closed and are
   * strict: HTTPS only, no embedded credentials, a bare origin with nothing
   * smuggled in the path/query/fragment, and a normal public domain (not an
   * IP, localhost, or punycode lookalike). The value is only ever shown as
   * text, never executed.
   */
  private parseInstanceOrigin(raw: string | null): string | null {
    if (!raw || raw.length > 253) {
      return null;
    }
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      return null;
    }
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;
    if (!STRICT_HOSTNAME.test(url.hostname)) return null;
    if (url.hostname.includes("xn--")) return null;
    return url.origin;
  }

  private titleFromSlug(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
