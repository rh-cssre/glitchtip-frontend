# GlitchTip Design Language

This is the source of truth for GlitchTip's visual language: the tokens, the rules for using them, and the reasoning behind them. It is written for humans first, and its structure also makes it legible to AI coding assistants so generated UI stays on system.

The living, interactive version of this document is the **Component Preview** app (`projects/component-preview/`, run with `npm run preview`). It renders real components and reads token values live from the running theme.

The preview is the **north star**: it defines how each pattern should look and behave. Where the shipped product does not yet match a rule, that is tracked as a ticket, not a reason to water down the rule. Foundations (tokens, type, spacing) still read live from the theme so they cannot drift; component and pattern pages show the intended rule, and a `designNotes` chip flags any page whose ideal the product has not adopted yet.

## Direction

We have been moving toward a **rapid-prototype, code-first, AI-readable design system**:

- **Code-first.** The reference renders real components and resolves tokens live from the DOM, not a static mock or a Figma file that goes stale the moment code changes.
- **Rapid-prototype.** A registry drives the preview: surfacing a new component or foundation is one entry in `registry.ts`, so the system grows in minutes.
- **AI-readable.** Explicit tokens plus this written spec let an assistant generate and review UI against a single source of truth instead of inventing generic defaults.

## Tokens

All tokens are CSS custom properties. Read them live; never hardcode a raw value that a token already expresses.

### Color

- **Material 3 system roles:** `--mat-sys-*` (primary, surface, on-surface, error, outline, and their containers). Defined by `@include mat.theme(...)` in `src/styles.scss`.
- **Extended app roles:** `--warning-color`, `--info-color`, `--success-color` (each with a `-container` and `on-` pair), plus product accents `--issues-color`, `--uptime-color`, `--logs-color`. Defined at `:root` in `src/styles.scss`.
- **Theming:** light and dark are driven by `color-scheme` and `prefers-color-scheme`. The brand overrides for `--mat-sys-primary` and `--mat-sys-error` in dark mode are gated on the OS setting.

Rule: use a semantic role, not a raw hex. Text on a colored surface uses that surface's `on-` token so contrast holds in both schemes.

### Typography

- **Material 3 type tokens:** `--mat-sys-headline-small`, `-title-large/medium/small`, `-body-large/medium/small`, `-label-large/medium`. Apply as `font: var(--token)`.
- **Semantic classes** (in `src/assets/styles/_font-files.scss`): `.section-header-text` (page titles), `.section-header-text-light` (issue titles), `.body-text`, `.body-text-strong`, `.caption-text`. These are responsive.
- **Fonts:** IBM Plex Sans (UI), IBM Plex Mono (code), Material Symbols (icons), all self-hosted as woff2.

Rule: prefer a semantic class where one exists; otherwise apply the matching type token.

### Spacing

8px base grid, exposed as `--gt-space-*`:

| Token | Value |
| --- | --- |
| `--gt-space-0` | 0 |
| `--gt-space-1` | 4px |
| `--gt-space-2` | 8px |
| `--gt-space-3` | 12px |
| `--gt-space-4` | 16px |
| `--gt-space-5` | 24px |
| `--gt-space-6` | 32px |
| `--gt-space-7` | 48px |

Rule: use these in new code instead of ad-hoc pixel values. Migrating existing usage onto the scale is planned follow-up work.

### Radius and elevation

Corner radius is `$shape-radius` (4px). Elevation uses Material 3 `--mat-sys-level*` shadows.

## Components

Reusable components live in `src/app/shared/`. Each documented component in the preview app carries: a description, when-to-use guidance, do and don't lists, an accessibility note, and a copyable usage snippet (via the shared `preview-doc` wrapper).

Conventions for every component:

- Standalone, `ChangeDetectionStrategy.OnPush`, signal inputs and outputs.
- Selector prefix `gt-`.
- Build write and delete controls behind the relevant permission signal (see the permission-gating convention in `CLAUDE.md`).

## Accessibility

- Color pairings must meet WCAG contrast; the preview app shows on-color pairings for a quick check.
- Interactive controls are keyboard reachable and have an accessible name.
- State (loading, disabled, selected) is conveyed by more than color alone.

## Governance

- The preview app is the **north-star rulebook**; the product aligns to it via audit tickets, not the reverse. Deliberate divergence (rule set here, product migrated via tickets) is the model; ad-hoc divergence is not.
- Run a **style audit** per pattern to measure product drift and turn the gaps into tracked tickets.
- Document what the product ships, not what mature systems have. A page earns its place by answering questions developers actually hit; benchmark gaps are candidates, not requirements.
- Add a component or foundation by adding a `registry.ts` entry and, where useful, wrapping it in `preview-doc`.

### Page recipe

Every page follows one of two templates so pages read the same way.

**Component and pattern pages** wrap the example in `preview-doc`, which fixes the section order. Fill, top to bottom:

- **description**: one or two plain sentences. What it is and where it is used.
- the live example (projected content).
- **When to use / Do / Don't**: short imperative lines.
- **Writing**: how to word the component's labels and copy. Include it when the component has user-facing text (button labels, dialog copy, banner headlines, field labels); omit it otherwise.
- **Accessibility**: the one thing an implementer must get right.
- **Keyboard**: only when the component has behavior beyond default tab-and-activate.
- **Anatomy**: the named parts, when the component has parts worth naming.
- **Relationships**: which components this one is meant to sit inside (`within`) and which it is meant to hold (`contains`). Include it wherever composition is not obvious. Every claim must be verifiable in product code (grep the usage before writing it); omit `within` when a component is used everywhere, and qualify a `contains` that only holds for one variant.
- **Properties**: the input/output table.
- **Usage**: a copyable snippet of the real component.

Required on every component page: description, example, When to use, Do, Don't, Accessibility, Properties, Usage. Writing, Keyboard, and Anatomy are added only when they carry real information, never as filler.

**Foundation and reference pages** (colors, spacing, typography, icons, symbols) do not use `preview-doc`. They document tokens or assets, not usage, so they use a page header, a one-line lead, and the reference content, and they read values live from the theme wherever possible so they cannot drift. They carry no When to use or Do/Don't.

Voice: plain and human. A verb-first instruction beats a description of one. No em or en dashes. Only essential, helpful information.

Icons: a preview example may only use a Material Symbol that is in the app's self-hosted subset (the list on the Material symbols page); any other name renders as broken ligature text, not a glyph.

### Component lifecycle

Every documented component carries a status, following the practice of published design systems (Polaris, USWDS, Carbon):

- **stable**: current conventions (signal inputs/outputs, OnPush), reviewed, safe to use.
- **legacy**: works and is supported, but predates current conventions and is slated for an update. Fine to use; expect changes.
- **deprecated**: do not use in new code; the component's page names the replacement.

Statuses live on the `registry.ts` entry and render as each page's `preview-doc` chip (the nav stays label-only so it cannot overflow). Updating a legacy component to current conventions flips its badge to stable, which makes modernization progress visible.

### Visual audit notes

Orthogonal to the lifecycle status (which tracks code conventions), a page can carry `designNotes`: neutral chips flagging design polish, e.g. "visual refresh planned" or "off-system by design". These come out of the visual audit done while isolating components into this guide, and each note is expected to become a ticket. This keeps two honest, separate answers on every component: is the code current, and does it look on-system.

## Hosting

The style guide is published with GitLab Pages, sharing the one Pages site this project gets with the marketing website: marketing at the root domain, the style guide at `/style-guide/`. Both are built by the single `pages` job in `.gitlab-ci.yml`.

Why this shape:

- A GitLab project has exactly one Pages site. A second `pages` job on another branch would replace the marketing site, so the style guide must build inside the same job.
- The job runs on the `marketing` branch. To refresh the published style guide, merge `master` into `marketing` (the same flow as a website update). Publication is therefore a deliberate release, not automatic on every master commit.
- The style guide build passes `--base-href /style-guide/`; that value must match the subpath or its assets 404.
- The page is world-readable on the marketing domain. Treat it as public: it is a component library and a credibility asset, and nothing confidential belongs in it.
- If we later want the style guide tracking `master` independently of marketing releases, the upgrade paths are GitLab parallel Pages deployments (`pages.path_prefix`, paid tier; GlitchTip may qualify through the GitLab Open Source Program) or a dedicated project.

Until it is published, run it locally with `npm run preview` (port 4300, requires node 22+).

## Roadmap

Direction for the system beyond the current guide, roughly in order:

1. **Audit tickets.** Work through the tracked backlog: standardize submit buttons on gt-loading-button, promote gt-empty-state, fix the deprecated gt-form-error input, then the medium/low items.
2. **API-table sync check.** The properties tables in the guide are hand-written; add a small check (script or agent step) that diffs each component's `input()`/`output()` signatures against its documented `api` rows so the docs cannot silently drift.
3. **Visual regression.** Screenshot the guide's pages in CI (Playwright) and diff on merge requests, so token or component changes show up as reviewable image diffs.
4. **Brand tokens partial.** The Brand section is live in the guide (Product | Brand toolbar tabs): marketing shares the product's Material theme and adds display typography (`.marketing-heading` scale), the `.fancy` italic accent, and two accent tokens (`--mkt-accent-blue/yellow`). Those brand styles are currently mirrored into the preview's stylesheet; extract them into a shared partial that both marketing and the preview import so there is a single source.
5. **Design-system assistant.** Defined in `ASSISTANT.md`: a chat assistant over the structured registry, preview files, tokens, and this document, answering the long-tail questions ("which component for X?", "how does this behave on mobile?") so the written docs stay lean while depth is on demand. Near term it is a Claude Project / GPT fed those files; later an "Ask" panel in the hosted guide. This is what lets us document principles and canonical examples rather than every edge case by hand.
6. **Storybook evaluation.** Revisit if the guide passes ~25 components or a designer joins who needs an interactive controls panel; the content (tokens, guidance, API rows) ports to Storybook MDX either way.
