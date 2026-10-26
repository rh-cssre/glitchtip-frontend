import { Type } from "@angular/core";
import { LoadingButtonPreview } from "./previews/loading-button.preview";
import { CopyInputPreview } from "./previews/copy-input.preview";
import { StepperPreview } from "./previews/stepper.preview";
import { TablePatternPreview } from "./previews/table-pattern.preview";
import { ChartsPreview } from "./previews/charts.preview";
import { FormsPreview } from "./previews/forms.preview";
import { ConfirmDialogPreview } from "./previews/confirm-dialog.preview";
import { ButtonsPreview } from "./previews/buttons.preview";
import { TopAppBarPreview } from "./previews/top-app-bar.preview";
import { DetailPagePreview } from "./previews/detail-page.preview";
import { PermissionGatingPreview } from "./previews/permission-gating.preview";
import { BrandTypographyPreview } from "./previews/brand-typography.preview";
import { BrandColorsPreview } from "./previews/brand-colors.preview";
import { BrandCtaPreview } from "./previews/brand-cta.preview";
import { BrandCardPreview } from "./previews/brand-card.preview";
import { BrandOverviewPreview } from "./previews/brand-overview.preview";
import { BrandPricingCardPreview } from "./previews/brand-pricing-card.preview";
import { BrandQaPreview } from "./previews/brand-qa.preview";
import { BrandSimpleTablePreview } from "./previews/brand-simple-table.preview";
import { BrandLayoutPreview } from "./previews/brand-layout.preview";
import { BrandSectionHeaderPreview } from "./previews/brand-section-header.preview";
import { BrandCodeCardPreview } from "./previews/brand-code-card.preview";
import { BrandPageShellPreview } from "./previews/brand-page-shell.preview";
import { BrandBannerPreview } from "./previews/brand-banner.preview";
import { BrandMotionPreview } from "./previews/brand-motion.preview";
import { ProjectCardPreview } from "./previews/project-card.preview";
import { BannersPreview } from "./previews/banners.preview";
import { IconsPreview } from "./previews/icons.preview";
import { SymbolsPreview } from "./previews/symbols.preview";
import { FoundationsColorsPreview } from "./previews/foundations-colors.preview";
import { FoundationsTypographyPreview } from "./previews/foundations-typography.preview";
import { FoundationsSpacingPreview } from "./previews/foundations-spacing.preview";
import { FoundationsVoicePreview } from "./previews/foundations-voice.preview";
import { FoundationsAccessibilityPreview } from "./previews/foundations-accessibility.preview";
import { OverviewPreview } from "./previews/overview.preview";
import { PaginationPreview } from "./previews/pagination.preview";
import { IconUsagePreview } from "./previews/icon-usage.preview";
import { EntryDataPreview } from "./previews/entry-data.preview";
import { SummaryCardPreview } from "./previews/summary-card.preview";
import { TokensCatalogPreview } from "./previews/tokens-catalog.preview";
import { TabsPreview } from "./previews/tabs.preview";
import { ToastsPreview } from "./previews/toasts.preview";
import { DialogsPreview } from "./previews/dialogs.preview";
import { LoadingOverlayPreview } from "./previews/loading-overlay.preview";
import { EmptyStatePreview } from "./previews/empty-state.preview";

/**
 * Component lifecycle status, following the practice of published design
 * systems (Polaris, USWDS, Carbon):
 * - `stable`: current conventions, reviewed, safe to use.
 * - `legacy`: works and is supported, but predates current conventions and is
 *   slated for an update. Fine to use; expect changes.
 * - `deprecated`: do not use in new code; the entry's docs should name the
 *   replacement.
 * Foundations and asset pages carry no status. The status renders as the
 * page's chip only; the nav stays label-only so it cannot overflow.
 */
export type PreviewStatus = "stable" | "legacy" | "deprecated";

/**
 * Top-level audience section. "product" documents the app's design system;
 * "brand" documents the marketing site's visual language. The toolbar switch
 * flips between them; groups and deep links work the same in both.
 */
export type PreviewSection = "product" | "brand";

export interface PreviewEntry {
  id: string;
  label: string;
  group: string;
  component: Type<unknown>;
  status?: PreviewStatus;
  /** Defaults to "product" when omitted. */
  section?: PreviewSection;
}

/**
 * The set of components/styles this preview app demonstrates. This is a
 * deliberately small, curated list — add an entry here to surface a new
 * component. Each entry's `component` is a tiny standalone preview that imports
 * the real app component and renders it with sensible defaults.
 */
export const PREVIEWS: PreviewEntry[] = [
  {
    id: "overview",
    label: "Overview",
    group: "Get started",
    component: OverviewPreview,
  },
  {
    id: "foundations-colors",
    label: "Colors",
    group: "Foundations",
    component: FoundationsColorsPreview,
  },
  {
    id: "foundations-typography",
    label: "Typography",
    group: "Foundations",
    component: FoundationsTypographyPreview,
  },
  {
    id: "foundations-spacing",
    label: "Layout",
    group: "Foundations",
    component: FoundationsSpacingPreview,
  },
  {
    id: "tokens",
    label: "Design tokens",
    group: "Foundations",
    component: TokensCatalogPreview,
  },
  {
    id: "voice-tone",
    label: "Voice and tone",
    group: "Foundations",
    component: FoundationsVoicePreview,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    group: "Foundations",
    component: FoundationsAccessibilityPreview,
  },
  {
    id: "top-app-bar",
    label: "Top app bar",
    group: "Components",
    component: TopAppBarPreview,
    status: "stable",
  },
  {
    id: "loading-button",
    label: "Loading button",
    group: "Components",
    component: LoadingButtonPreview,
    status: "stable",
  },
  {
    id: "copy-input",
    label: "Copy input",
    group: "Components",
    component: CopyInputPreview,
    status: "stable",
  },
  {
    id: "stepper",
    label: "Stepper",
    group: "Components",
    component: StepperPreview,
    status: "stable",
  },
  {
    id: "project-card",
    label: "Project card",
    group: "Components",
    component: ProjectCardPreview,
    status: "legacy",
  },
  {
    id: "banners",
    label: "Banners",
    group: "Components",
    component: BannersPreview,
    status: "stable",
  },
  {
    id: "confirm-dialog",
    label: "Confirm dialog",
    group: "Components",
    component: ConfirmDialogPreview,
    status: "stable",
  },
  {
    id: "pagination",
    label: "Pagination buttons",
    group: "Components",
    component: PaginationPreview,
    status: "legacy",
  },
  {
    id: "loading-overlay",
    label: "Loading overlay",
    group: "Components",
    component: LoadingOverlayPreview,
    status: "stable",
  },
  {
    id: "entry-data",
    label: "Entry data",
    group: "Components",
    component: EntryDataPreview,
    status: "stable",
  },
  {
    id: "summary-card",
    label: "Summary card",
    group: "Components",
    component: SummaryCardPreview,
    status: "stable",
  },
  {
    id: "empty-state",
    label: "Empty state",
    group: "Components",
    component: EmptyStatePreview,
    status: "stable",
  },
  {
    id: "buttons",
    label: "Buttons & actions",
    group: "Patterns",
    component: ButtonsPreview,
    status: "stable",
  },
  {
    id: "table-pattern",
    label: "Table",
    group: "Patterns",
    component: TablePatternPreview,
    status: "stable",
  },
  {
    id: "charts",
    label: "Charts",
    group: "Patterns",
    component: ChartsPreview,
    status: "stable",
  },
  {
    id: "toasts",
    label: "Toasts",
    group: "Patterns",
    component: ToastsPreview,
    status: "stable",
  },
  {
    id: "dialogs",
    label: "Dialogs",
    group: "Patterns",
    component: DialogsPreview,
    status: "stable",
  },
  {
    id: "tabs",
    label: "Tabs",
    group: "Patterns",
    component: TabsPreview,
    status: "stable",
  },
  {
    id: "forms",
    label: "Forms",
    group: "Patterns",
    component: FormsPreview,
    status: "stable",
  },
  {
    id: "detail-page",
    label: "Detail page",
    group: "Patterns",
    component: DetailPagePreview,
    status: "stable",
  },
  {
    id: "permission-gating",
    label: "Permission gating",
    group: "Patterns",
    component: PermissionGatingPreview,
    status: "stable",
  },
  {
    id: "brand-overview",
    label: "Overview",
    group: "Get started",
    section: "brand",
    component: BrandOverviewPreview,
  },
  {
    id: "brand-typography",
    label: "Typography",
    group: "Foundations",
    section: "brand",
    component: BrandTypographyPreview,
  },
  {
    id: "brand-colors",
    label: "Colors",
    group: "Foundations",
    section: "brand",
    component: BrandColorsPreview,
  },
  {
    id: "brand-layout",
    label: "Layout",
    group: "Foundations",
    section: "brand",
    component: BrandLayoutPreview,
  },
  {
    id: "brand-cta",
    label: "Buttons & CTAs",
    group: "Patterns",
    section: "brand",
    component: BrandCtaPreview,
    status: "stable",
  },
  {
    id: "brand-card",
    label: "Cards & surfaces",
    group: "Patterns",
    section: "brand",
    component: BrandCardPreview,
    status: "stable",
  },
  {
    id: "brand-motion",
    label: "Motion",
    group: "Patterns",
    section: "brand",
    component: BrandMotionPreview,
    status: "stable",
  },
  {
    id: "brand-pricing-card",
    label: "Pricing card",
    group: "Components",
    section: "brand",
    component: BrandPricingCardPreview,
    status: "stable",
  },
  {
    id: "brand-qa",
    label: "Question & answer",
    group: "Components",
    section: "brand",
    component: BrandQaPreview,
    status: "stable",
  },
  {
    id: "brand-simple-table",
    label: "Simple table",
    group: "Components",
    section: "brand",
    component: BrandSimpleTablePreview,
    status: "stable",
  },
  {
    id: "brand-section-header",
    label: "Section header",
    group: "Components",
    section: "brand",
    component: BrandSectionHeaderPreview,
    status: "stable",
  },
  {
    id: "brand-code-card",
    label: "Code card",
    group: "Components",
    section: "brand",
    component: BrandCodeCardPreview,
    status: "stable",
  },
  {
    id: "brand-page-shell",
    label: "Page shell",
    group: "Components",
    section: "brand",
    component: BrandPageShellPreview,
    status: "stable",
  },
  {
    id: "brand-banner",
    label: "Banner",
    group: "Components",
    section: "brand",
    component: BrandBannerPreview,
    status: "stable",
  },
  {
    id: "icon-usage",
    label: "Icon usage",
    group: "Assets",
    component: IconUsagePreview,
  },
  {
    id: "icons",
    label: "Icons (logos)",
    group: "Assets",
    component: IconsPreview,
  },
  {
    id: "symbols",
    label: "Material symbols",
    group: "Assets",
    component: SymbolsPreview,
  },
];

/**
 * Preview entries for one section, grouped by their `group`, preserving
 * insertion order.
 */
export function groupedPreviews(
  section: PreviewSection = "product",
): { group: string; entries: PreviewEntry[] }[] {
  const groups: { group: string; entries: PreviewEntry[] }[] = [];
  for (const entry of PREVIEWS) {
    if ((entry.section ?? "product") !== section) continue;
    let bucket = groups.find((g) => g.group === entry.group);
    if (!bucket) {
      bucket = { group: entry.group, entries: [] };
      groups.push(bucket);
    }
    bucket.entries.push(entry);
  }
  return groups;
}
