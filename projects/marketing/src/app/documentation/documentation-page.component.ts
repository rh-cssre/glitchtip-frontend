import {
  Component,
  OnInit,
  ElementRef,
  PLATFORM_ID,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ViewportScroller, isPlatformBrowser } from "@angular/common";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { SeoService } from "../shared/seo.service";

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

@Component({
  imports: [MatCard, MatCardContent, RouterLink, MarkdownComponent],
  templateUrl: "./documentation-page.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./documentation-page.component.scss"],
})
export class DocumentationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private markdownService = inject(MarkdownService);
  private viewportScroller = inject(ViewportScroller);
  private seo = inject(SeoService);
  private host = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);

  slug: string | null = null;

  ngOnInit(): void {
    const pageSlug: string = this.route.snapshot.params.slug;
    const locationPrefix = `/documentation/${pageSlug}`;
    this.seo.setPageSeo({
      title: `${this.titleFromSlug(pageSlug)} — Documentation`,
    });

    this.markdownService.renderer.heading = ({ text, depth }) => {
      const escapedText = text
        .toLowerCase()
        // replace non-letter characters with hyphens
        .replace(/[^\w]+/g, "-")
        //trim hyphens at start and end of string
        .replace(/^-+|-+$/g, "");
      return (
        `<h${depth} class="anchor">` +
        `<a id="${escapedText}" href="${locationPrefix}#${escapedText}">` +
        text +
        "</a>" +
        `</h${depth}>`
      );
    };

    this.slug = locationPrefix + ".md";
  }

  onMarkdownReady() {
    this.fillInstancePlaceholder();
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      this.viewportScroller.scrollToAnchor(fragment);
    }
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
