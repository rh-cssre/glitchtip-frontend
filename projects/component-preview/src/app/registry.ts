import { Type } from "@angular/core";
import { LoadingButtonPreview } from "./previews/loading-button.preview";
import { CopyInputPreview } from "./previews/copy-input.preview";
import { ToDoItemPreview } from "./previews/to-do-item.preview";
import { TypographyPreview } from "./previews/typography.preview";
import { IconsPreview } from "./previews/icons.preview";
import { SymbolsPreview } from "./previews/symbols.preview";

export interface PreviewEntry {
  id: string;
  label: string;
  group: string;
  component: Type<unknown>;
}

/**
 * The set of components/styles this preview app demonstrates. This is a
 * deliberately small, curated list — add an entry here to surface a new
 * component. Each entry's `component` is a tiny standalone preview that imports
 * the real app component and renders it with sensible defaults.
 */
export const PREVIEWS: PreviewEntry[] = [
  {
    id: "loading-button",
    label: "Loading button",
    group: "Components",
    component: LoadingButtonPreview,
  },
  {
    id: "copy-input",
    label: "Copy input",
    group: "Components",
    component: CopyInputPreview,
  },
  {
    id: "to-do-item",
    label: "To-do item",
    group: "Components",
    component: ToDoItemPreview,
  },
  {
    id: "typography",
    label: "Typography",
    group: "Styles",
    component: TypographyPreview,
  },
  {
    id: "icons",
    label: "Icons (logos)",
    group: "Styles",
    component: IconsPreview,
  },
  {
    id: "symbols",
    label: "Material symbols",
    group: "Styles",
    component: SymbolsPreview,
  },
];

/** Preview entries grouped by their `group`, preserving insertion order. */
export function groupedPreviews(): { group: string; entries: PreviewEntry[] }[] {
  const groups: { group: string; entries: PreviewEntry[] }[] = [];
  for (const entry of PREVIEWS) {
    let bucket = groups.find((g) => g.group === entry.group);
    if (!bucket) {
      bucket = { group: entry.group, entries: [] };
      groups.push(bucket);
    }
    bucket.entries.push(entry);
  }
  return groups;
}
