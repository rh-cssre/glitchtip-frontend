import { Component, ChangeDetectionStrategy } from "@angular/core";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * gt-pagination-buttons: cursor-based prev/next paging used on list pages.
 * Legacy conventions (decorator @Input, eager change detection); still the
 * standard control for paging a table.
 */
@Component({
  selector: "preview-pagination",
  imports: [PaginationButtons, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .pg-demo {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-2);
      }
      .pg-demo__label {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Pagination buttons"
      status="legacy"
      description="Cursor-based previous/next paging for list pages (issues, releases, transaction groups, monitor checks). The buttons carry the next and previous cursor in the URL, so a page is shareable and the back button works. Each arrow disables at the end of its direction."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Each arrow is an icon button; the aria-label names the direction. Disabled ends are conveyed by the native disabled state, not color alone."
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">States</div>
        <div class="pg-demo">
          <span class="pg-demo__label">First page (previous disabled)</span>
          <gt-pagination-buttons [paginator]="start" />
          <span class="pg-demo__label">A middle page (both enabled)</span>
          <gt-pagination-buttons [paginator]="middle" />
          <span class="pg-demo__label">Last page (next disabled)</span>
          <gt-pagination-buttons [paginator]="end" />
          <span class="pg-demo__label">Loading (spinner while the page loads)</span>
          <gt-pagination-buttons [paginator]="middle" [loading]="true" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class PaginationPreview {
  readonly start = {
    previousPageParams: null,
    hasPreviousPage: false,
    nextPageParams: { cursor: ["1"] },
    hasNextPage: true,
  };
  readonly middle = {
    previousPageParams: { cursor: ["0"] },
    hasPreviousPage: true,
    nextPageParams: { cursor: ["2"] },
    hasNextPage: true,
  };
  readonly end = {
    previousPageParams: { cursor: ["1"] },
    hasPreviousPage: true,
    nextPageParams: null,
    hasNextPage: false,
  };

  readonly whenToUse = [
    "Paging a data table or list that loads a page at a time",
    "Anywhere the backend returns a cursor for the next and previous page",
  ];
  readonly dos = [
    "Bind the paginator object the list endpoint returns",
    "Set loading while the next page is in flight so the arrows show a spinner",
    "Pair it with the Table pattern's keep-previous-rows behavior",
  ];
  readonly donts = [
    "Build page-number links; paging here is cursor-based, not offset-based",
    "Hide the control when a direction runs out; disable that arrow instead",
  ];
  readonly anatomy = `<gt-pagination-buttons [paginator]="..." [loading]="..." />`;
  readonly composition = {
    within: ["Table"],
  };
  readonly api: ApiRow[] = [
    { name: "paginator", type: "{ hasPreviousPage, previousPageParams, hasNextPage, nextPageParams }", default: "", description: "Cursor state from the list endpoint; drives the links and disabled states" },
    { name: "loading", type: "boolean", default: "false", description: "Shows a spinner in place of the arrows while a page loads" },
  ];
  readonly importCode = `import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";`;
  readonly code = `<gt-pagination-buttons
  [paginator]="issues.paginator()"
  [loading]="issues.loading()"
/>`;
}
