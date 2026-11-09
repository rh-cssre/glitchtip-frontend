import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { KeyRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Tabs pattern: mat-tab-group for switching between related views within one
 * context (an event's detail sections, a monitor's checks vs history). Not for
 * navigating between pages.
 */
@Component({
  selector: "preview-tabs",
  imports: [MatTabsModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .tab-body {
        padding: var(--gt-space-4);
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Tabs"
      status="stable"
      description="Tabs switch between related views that belong to one thing: the sections of an event, a monitor's checks and history. They keep the context on screen and swap only the panel below. Tabs are not page navigation; that is the nav and the router."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="mat-tab-group ties each tab to its panel and announces the selected tab. Only the active panel is in the tab order, so hidden panels do not trap focus."
      [keyboard]="keyboard"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Live example</div>
        <mat-tab-group>
          <mat-tab label="Overview">
            <div class="tab-body">
              The default view. Put the most-used content in the first tab.
            </div>
          </mat-tab>
          <mat-tab label="Events">
            <div class="tab-body">
              A related view of the same record, swapped in below the tabs.
            </div>
          </mat-tab>
          <mat-tab label="Tags">
            <div class="tab-body">
              Another facet of the same context. Labels stay short.
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </preview-doc>
  `,
})
export class TabsPreview {
  readonly whenToUse = [
    "Switching between facets of one record (an event's sections, a monitor's checks vs history)",
    "Keeping the page context while swapping a panel below",
  ];
  readonly dos = [
    "Group closely related content that shares one context",
    "Keep labels to short nouns",
    "Put the most-used view in the first tab, the default",
  ];
  readonly donts = [
    "Use tabs to navigate between pages; that is the nav and the router",
    "Hide a critical action behind a non-default tab",
    "Pack in so many tabs they overflow; if so, rethink the grouping",
  ];
  readonly keyboard: KeyRow[] = [
    { keys: "Left / Right", description: "Move between tabs" },
    { keys: "Tab", description: "Move from the selected tab into its panel" },
    { keys: "Home / End", description: "Jump to the first or last tab" },
  ];
  readonly code = `<mat-tab-group>
  <mat-tab label="Overview">...</mat-tab>
  <mat-tab label="Events">...</mat-tab>
  <mat-tab label="Tags">...</mat-tab>
</mat-tab-group>`;
}
