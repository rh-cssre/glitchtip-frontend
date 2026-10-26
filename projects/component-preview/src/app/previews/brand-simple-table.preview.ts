import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SimpleTableComponent } from "projects/marketing/src/app/shared/simple-table/simple-table.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-brand-simple-table",
  imports: [SimpleTableComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="Simple table"
      status="stable"
      description="A plain comparison table for marketing pages: pass column headers and rows of strings and it renders real th headers. Static, no sorting or selection, that is the product Table pattern's job."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Column headers are real th elements, so a screen reader associates each cell with its column."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section preview-narrow">
        <div class="preview-section__title">Plan comparison</div>
        <mkt-simple-table [columns]="columns" [rows]="rows" />
      </div>
    </preview-doc>
  `,
})
export class BrandSimpleTablePreview {
  readonly columns = ["Plan", "Events / mo", "Price"];
  readonly rows = [
    ["Free", "1,000", "$0"],
    ["Team", "100,000", "$29"],
    ["Business", "1M", "$99"],
  ];

  readonly whenToUse = [
    "Plan or feature comparisons on brand pages",
    "Any small static grid of text on the marketing site",
  ];
  readonly dos = [
    "Keep it to a handful of columns so it does not scroll",
    "Lead with the row's identifying value (the plan name)",
  ];
  readonly donts = [
    "Use it for interactive product data; reach for the product Table pattern",
  ];
  readonly api: ApiRow[] = [
    { name: "columns", type: "string[] (required)", default: "", description: "Header labels, one per column" },
    { name: "rows", type: "string[][] (required)", default: "", description: "Each row is an array of cell strings, in column order" },
  ];
  readonly code = `<mkt-simple-table
  [columns]="['Plan', 'Events / mo', 'Price']"
  [rows]="[['Free', '1,000', '$0'], ['Team', '100,000', '$29']]"
/>`;
}
