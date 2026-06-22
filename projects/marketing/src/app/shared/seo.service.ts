import { DOCUMENT } from "@angular/common";
import { Injectable, Injector, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

const SITE_URL = "https://glitchtip.com";
const SITE_NAME = "GlitchTip";
const DEFAULT_DESCRIPTION =
  "GlitchTip is an open source, Sentry API compatible error tracking platform.";
const DEFAULT_IMAGE = `${SITE_URL}/assets/glitchtip-saas.png`;

export interface PageSeo {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

@Injectable({ providedIn: "root" })
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private injector = inject(Injector);
  private document = inject(DOCUMENT);

  setPageSeo(seo: PageSeo = {}) {
    const bareTitle = seo.title || SITE_NAME;
    const fullTitle = seo.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME;
    const description = seo.description || DEFAULT_DESCRIPTION;
    const path = this.injector.get(Router).url.split("#")[0].split("?")[0];
    const url = SITE_URL + (path === "/" ? "" : path);
    const image = this.absoluteUrl(seo.image) || DEFAULT_IMAGE;
    const type = seo.type || "website";

    this.titleService.setTitle(fullTitle);
    this.upsert("name", "description", description);
    this.upsert("property", "og:title", bareTitle);
    this.upsert("property", "og:description", description);
    this.upsert("property", "og:url", url);
    this.upsert("property", "og:image", image);
    this.upsert("property", "og:type", type);
    this.upsert("name", "twitter:card", "summary_large_image");
    this.upsert("name", "twitter:title", bareTitle);
    this.upsert("name", "twitter:description", description);
    this.upsert("name", "twitter:image", image);

    if (seo.publishedTime) {
      this.upsert("property", "article:published_time", seo.publishedTime);
    } else {
      this.meta.removeTag('property="article:published_time"');
    }

    this.setCanonical(url);
  }

  private upsert(attr: "name" | "property", key: string, value: string) {
    const selector = `${attr}="${key}"`;
    const tag = { [attr]: key, content: value };
    if (this.meta.getTag(selector)) {
      this.meta.updateTag(tag, selector);
    } else {
      this.meta.addTag(tag);
    }
  }

  private setCanonical(url: string) {
    let link = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = this.document.createElement("link");
      link.setAttribute("rel", "canonical");
      this.document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }

  private absoluteUrl(src?: string): string | undefined {
    if (!src) return undefined;
    if (/^https?:\/\//i.test(src)) return src;
    return SITE_URL + (src.startsWith("/") ? src : `/${src}`);
  }
}
