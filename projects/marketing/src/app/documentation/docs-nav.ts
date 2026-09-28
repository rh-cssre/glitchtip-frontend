/**
 * Single source of truth for documentation navigation. Drives the sidebar, the
 * index landing, the breadcrumb and prev/next. Previously this structure only
 * existed as hand-authored markup in documentation-index.component.html.
 */
export interface DocLink {
  title: string;
  /** Slug of an internal markdown doc page (rendered by DocumentationPage). */
  slug?: string;
  /** External destination: an in-app router path ('/hipaa') or an https URL. */
  href?: string;
}

export interface DocGroup {
  title: string;
  summary: string;
  items: DocLink[];
}

export const DOCS_NAV: DocGroup[] = [
  {
    title: "Using GlitchTip",
    summary: "Basic information to help you get started.",
    items: [
      {
        slug: "frequently-asked-questions",
        title: "Frequently asked questions",
      },
      { slug: "getting-started", title: "Getting started" },
      { slug: "on-demand-billing", title: "On-demand billing and spend caps" },
    ],
  },
  {
    title: "Feature guides",
    summary: "Get GlitchTip up and running for your app.",
    items: [
      { slug: "error-tracking", title: "Error tracking" },
      { href: "/sdkdocs", title: "SDK integration" },
      { slug: "performance", title: "Performance monitoring" },
      { slug: "uptime-monitoring", title: "Uptime monitoring" },
      { slug: "logs", title: "Logs" },
      { slug: "integrations", title: "Integrations" },
      { slug: "mcp", title: "MCP (AI integration)" },
      { slug: "cli", title: "CLI (beta)" },
    ],
  },
  {
    title: "Self-hosting",
    summary: "Run the source on a server you control.",
    items: [
      { slug: "install", title: "Installation guide" },
      { slug: "hosted-architecture", title: "Hosted architecture" },
    ],
  },
  {
    title: "Contributing",
    summary: "Help make GlitchTip better.",
    items: [
      { slug: "contribute", title: "Contributor guide" },
      {
        href: "https://app.glitchtip.com/api/docs",
        title: "API documentation",
      },
      { href: "/hipaa", title: "HIPAA compliance" },
    ],
  },
];

/** Ordered flat list of the internal doc pages, for prev/next navigation. */
export const DOC_ORDER: { slug: string; title: string }[] = DOCS_NAV.flatMap(
  (group) => group.items,
)
  .filter(
    (item): item is Required<Pick<DocLink, "slug" | "title">> => !!item.slug,
  )
  .map((item) => ({ slug: item.slug, title: item.title }));

/** Look up a doc page's title + its group title from a slug. */
export function findDoc(
  slug: string,
): { title: string; group: string } | undefined {
  for (const group of DOCS_NAV) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) {
      return { title: item.title, group: group.title };
    }
  }
  return undefined;
}
