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

Colour only for meaning: error, warning, success and status (level pills, status dots, the root cause bar, an unhandled pill). Bars, charts of counts and everything else stay neutral; key values get weight (600, on-surface), not colour.

### Typography

- **Material 3 type tokens:** `--mat-sys-headline-small`, `-title-large/medium/small`, `-body-large/medium/small`, `-label-large/medium`. Apply as `font: var(--token)`.
- **Semantic classes** (in `src/assets/styles/_font-files.scss`): `.section-header-text` (page titles), `.section-header-text-light` (issue titles), `.body-text`, `.body-text-strong`, `.caption-text`. These are responsive.
- **In-page subheading:** `.gt-subheading` (title-small, 600, on-surface, in `src/styles.scss`) for a heading inside a page section, such as a `gt-list` label. `.gt-subheading__description` is the muted line under it.
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

Corner radius is `$shape-radius` (4px). Badges (`.chip`) use `--mat-sys-corner-extra-small`; counts (`.tab-count`) and status pills use `--mat-sys-corner-full`. Elevation uses Material 3 `--mat-sys-level*` shadows.

## Components

Reusable components live in `src/app/shared/`. Each documented component in the preview app carries: a description, when-to-use guidance, do and don't lists, an accessibility note, and a copyable usage snippet (via the shared `preview-doc` wrapper).

Conventions for every component:

- Standalone, `ChangeDetectionStrategy.OnPush`, signal inputs and outputs.
- Selector prefix `gt-`.
- Build write and delete controls behind the relevant permission signal (see the permission-gating convention in `CLAUDE.md`).

### Panels

- Only the page header, tabs and section bars sit loose on the page; everything else (descriptions, copy fields, lists, empty states) is in a panel.
- A panel title that repeats the tab or page it sits in is left out. If the header still has actions, a muted fact leads it in `slot="lead"` (a list's count: "2 alerts", ICU plural with a named placeholder), so an action never sits in an empty strip. If there are no actions either, there is no header.
- Charts and data blocks (stack traces, breadcrumbs, request data, code, a record's table of spans) sit in a `gt-panel`. Use `flush` when the body draws its own rows. No `mat-card` for new work.
- A box's body uses the page colour (`surface-container-low`) with a hairline. Its header and footer strips are tinted one step up, in `surface-container-high`; a data table's column header row (`.table-header`) uses the same tint. A danger panel adds a red-tinted outline. There are no other panel variants.
- A tab's content sits in panels. An empty state sits centred in an outline panel; an empty panel has no header.

### Labels

Small labels come in four kinds. Shape says what kind of thing it is; color gives its value.

- **Badge:** a squared grey label for data you could copy or compare: identifiers in mono (`.chip`: an issue id, a URL), fixed attributes (`.list-row__tag`: Owner, Primary).
- **State:** a rounded grey pill with a colored dot (`gt-status-pill`) for a state that changes: Up, Down, Unresolved, Invite pending. A dot always means a state.
- **Level:** a rounded grey pill with a colored bar for severity (the issue level tag). A bar always means a level, as on issue list rows. Fatal, the most severe, is the one filled pill.
- **Count:** a rounded grey pill with a number (`.tab-count`) after a label.

Filters you can click are outlined tag chips (see Tag chips). Every label uses label-medium (12px).

### Page headers

Every record detail page opens with `gt-page-header`: the record's name, then one meta line of facts.

- Settings pages for a named object (organization, project, team, member) show an icon tile, using the same icon as that object's item in the nav. Data pages (issue, monitor, transaction, release) and profile pages do not.
- Those settings pages use `compact`: one line with a 32px tile, the title in title-large and the meta facts inline after it, wrapping under the title on a narrow screen. Data pages keep the full header.
- Data record pages open with a record band (`gt-record-band`): a tinted band over the page's full width that holds the page header. Up to three key facts sit in its top right corner as stats (`.gt-band-facts`): the number in `<b>` over a short muted label, on the title's baseline. Keep a label to a word or two and put any detail in a tooltip, which underlines the number. Shorten counts with `compactNumber` (12.3K) and durations with `shortDuration` (815ms, 1.60s). Further facts stay in the meta line. A summary of the whole record goes in the summary tier: a text summary (top tags) on a darker strip (`summary="strip"`), a graphic one (check bars) under a hairline; both span the band. The tab bar sits on the band's bottom edge. Write the corner facts once, as `.gt-band-fact` spans in an `ng-template`, and render it in both the corner and the end of the meta line; under 900px the corner hides and the meta line shows them. Settings records keep the compact header with no band.
- The meta line lists facts in order of importance. Numbers go in `<b>`, identifiers in a `.chip`. The component adds the separators.
- No meta fact repeats the title: no slug chip under the name it comes from, no project chip under a version that already names it. If nothing is left, leave out the meta row.
- A record with a state (a monitor's Up or Down) shows it with `gt-status-pill`, first in the meta line. The same pill shows that state in lists too.
- A fact that continues the pill ("for 2 hours") gets class `no-sep`, so no separator is drawn before it.
- When the record has facets, tabs sit directly below the header, with counts in `.tab-count`. The tab bar is the only line under a header; the header draws no divider.
- Tab counts only on tabs whose content is a growing list where the number informs (alerts, members, projects, environments); a tab holding a single thing (the project DSN/key) has no count.
- Tabs drawn by one component use a `?tab=` query param. Tabs that are separate routed components use child routes. The default tab has no `?tab=`, and tab clicks replace history. Counts show once known, including 0.
- The back link and page actions live in the top app bar, never in the header.
- The title is the record's own name, not a sentence about it ("checkout-api", not "Settings for checkout-api"). Titles have one style; an identifier title (an email, a version) is not set in mono.

### Top app bar

- The top app bar is 52px. Every control in it is 32px: compact buttons (`controls.compact-buttons` from `_controls.scss`, also used by panel headers) and ghost select filters. Visual customisation of Material goes through its overrides/density mixins in `material-overrides/`, never internal classes or `::ng-deep`.
- `_controls.scss` also holds the other shared control helpers; use them instead of raw values: `state-layer(hover|focus|pressed)` for hover and focus fills on our own controls (M3 opacity tokens), `icon-size($size)` for a mat-icon on a class the component owns, `focus-ring($offset)` for keyboard focus, `middot($gap)` for the dot between inline facts, `status-dot` for the dot that marks a state, and the named container widths `$narrow-bar`, `$narrow-panel`, `$wide-panel`, `$narrow-band` with their mixins `narrow-bar`, `narrow-panel`, `below-wide-panel`, `wide-panel`, `narrow-band` and `wide-band`.
- Bar filters are ghost selects (`.gt-select-ghost`): a `mat-select` with no form field, so the bar shows only text and a chevron, with no field outline. Hover, keyboard focus and open use the same grey state layer as text buttons (`state-layer(hover)`, then `state-layer(focus)` on focus and while open), with no focus ring and no primary colour. Wrap the select in a span with the `gtSelectGhost` directive: it adds the class, tracks the open state and opens the select on clicks in the padding. Give each one an `aria-label` and a fixed width; long names truncate.
- Bar text is one size on every page: the bar title (`.gt-bar-title`) and the back link both use title-medium (16px), so moving from a list to a record only adds the chevron. Big titles live in the page body (`gt-page-header`). A count after the bar title is a `.tab-count` badge, the same one tabs use, centred on the text; the title text then sits in `.gt-bar-title__text` so a long title ellipsizes and the count stays whole. No bare `h1` styling in a bar.
- The bar draws only its bottom border. Controls of one kind are separated by gap spacing. Between two groups of different kinds (filters | actions, state | destructive) put a `.gt-bar-divider`: 1px wide, 20px tall, `outline-variant`, centred, with 8px on each side. Never between two controls of the same kind, never at the bar edges, never with only one group.
- `$top-app-bar-height` in `src/assets/styles/_variables.scss` is the only place that sets the bar height; the top app bar, the list app bar and the full-height layout read it. No per-page height overrides. If a control does not fit, apply a Material density mixin in the bar's own stylesheet.
- The back link is `gt-back-link`, in the bar and in tab sub-views alike: a text link with a chevron, naming the parent page with that page's nav label ("Projects", "Uptime Monitors"). An edit form goes back to its record and shows the record's name. Use one label at every width; never "Back to" or "View all". The component pulls itself left by the button's leading inset (12px), so its chevron sits on the container edge wherever it is placed; don't add a local margin to compensate.
- List pages put one filled "New X" in the right slot.
- Record pages have no filled button in the bar. Primary is for at most one main create or confirm action per page. A record with an edit page links to it with an outlined "Edit X".
- A record's status control in the bar is an outlined neutral dropdown that shows the same coloured dot as `gt-status-pill`, never a filled primary button.
- Outline tells you what a control does: an action (it changes the record, like status, Edit, Delete, or it does something with the record, like Copy for AI) is an outlined button; a control that only changes what you see (filters, time range, App frames/Raw, frame order, categories) is a ghost select with no outline.
- One extra action in a record bar is a neutral 32px icon button with a tooltip and an `aria-label` ("Delete issue"). Two or more extra actions go in a "More actions" menu.
- Delete lives in one place. A record with a settings or edit page deletes from that page's last section (outlined warn button, then a confirm that names the object). A record without one deletes from the bar, as its icon button or a "More actions" item, with the same confirm.
- Verbs: "New X" opens a create form and is its title, "Create X" submits it, "Add X" attaches something that already exists, "Invite" sends an email.
- The right slot holds actions only, never facts such as the user's email.

### Lists

A collection of records with a name and a few actions is a `gt-list` of `gt-list-row`s: the name, optional muted facts, then the actions at the end. An optional description line sits under the name.

- A collection of records (a table, a `gt-list`, a code block) sits in a bordered container, with a line between rows.
- A row that opens its record makes the name the link, written `<a gtListRowLink>`. That makes the row navigable: the link's hit area covers the whole row, hovering the row draws the on-surface 8% state layer and underlines the name, keyboard focus rings the row. The link stays the only tab stop; row actions sit above the hit area and keep their own clicks. No separate Edit or View button repeats the link, and no chevron: a chevron means a row expands.
- A navigable row's meta is text. A control in the row (a copy button, a menu) goes in the actions slot, which sits above the hit area.
- One action on a row is a visible outlined button. Two or more go in a menu at the end of the row.
- Row actions stay neutral, destructive ones included; the confirm dialog carries the warning.
- Rows with several columns to compare or sort are a table instead.
- Several meta facts each get their own span inside `[slot="meta"]`; the row draws the separators, as `gt-page-header` does. Never type a separator into a translated string.
- A description line of facts (a project's platform and teams) gets `.list-row__facts`, so the row draws the same separators there.
- A row's state (Invite pending, Unverified) is a status pill after the name. A fixed attribute (Owner, Primary) is a neutral `.list-row__tag`, which is not interactive.
- When a row's action is blocked, say why in the row's description line; never only in a tooltip.
- A list page's create action is one filled "New <thing>" button in the top app bar. A list inside a record's tab puts it above the list as an outlined button with the add icon.
- Projects are listed with `gt-project-rows` everywhere. On Home and Projects a row shows the name, then platform, teams and last event, and on the right the last 14 days of errors (the issue list's trend bars) and the unresolved count; a click opens its issues. Settings > Projects is the setup view: platform, teams, the alert count when there are alerts, and the created date, with no trend; a click opens its settings. A project with no events yet shows a "No events yet" state pill. A row loads its numbers when it scrolls into view, at most four at once, with placeholder bars meanwhile. Projects use the `folder` icon everywhere.

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
