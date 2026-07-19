import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * gt-empty-state: the shared no-data state. One component so every empty list,
 * table and panel reads the same instead of each rolling its own text.
 */
@Component({
  selector: "preview-empty-state",
  imports: [
    EmptyStateComponent,
    MatButtonModule,
    MatIconModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .es-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--gt-space-4);
      }
      // A plain surface so the centered state reads the way it does in a panel.
      .es-surface {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background: var(--mat-sys-surface);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Empty state"
      status="stable"
      description="A centered icon, title, a short message and one optional action, shown when a list, table or panel has no data. Use it for every no-data state so they all read the same."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="The icon is decorative and hidden from screen readers; the title and message are plain text read in order. A projected action keeps its own button label."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">States</div>
        <p class="preview-section__note">
          No-data with a next step, no-data with the action elsewhere, and a
          no-results state after a filter.
        </p>
        <div class="es-grid">
          <div class="es-surface">
            <gt-empty-state
              icon="share_eta"
              title="No uptime monitors"
              message="Add a monitor to get alerted when a site or service goes down."
            >
              <button mat-flat-button color="primary">
                <mat-icon>add</mat-icon>
                Add monitor
              </button>
            </gt-empty-state>
          </div>
          <div class="es-surface">
            <gt-empty-state
              icon="rocket_launch"
              title="No releases"
              message="Releases appear here once you send release data with your events."
            />
          </div>
          <div class="es-surface">
            <gt-empty-state
              icon="search"
              title="No results"
              message="No logs match your filters. Try widening or clearing them."
            />
          </div>
        </div>
      </div>
    </preview-doc>
  `,
})
export class EmptyStatePreview {
  readonly whenToUse = [
    "A list, table or panel that has no data yet",
    "A no-results state after a search or filter",
  ];
  readonly dos = [
    "Keep the title a short, specific noun phrase: No uptime monitors",
    "Give one line of plain-language guidance in the message",
    "Project a single action, and only when there is a clear next step",
    "Reuse the feature's own icon so the state matches its nav item",
  ];
  readonly donts = [
    "Write a paragraph in the message",
    "Add more than one action",
    "Use it for a rich first-run onboarding screen; that is a separate, illustrated pattern",
  ];
  readonly content = [
    "Title: what is missing, as a short noun phrase",
    "Message: one line on how to fill it, in plain language",
  ];
  readonly api: ApiRow[] = [
    {
      name: "icon",
      type: "string",
      default: '""',
      description: "Material symbol name; omit for no icon",
    },
    {
      name: "title",
      type: "string",
      default: "",
      description: "Short heading naming what is missing (required)",
    },
    {
      name: "message",
      type: "string",
      default: '""',
      description: "One line of guidance; omit for title only",
    },
    {
      name: "headingLevel",
      type: "number",
      default: "3",
      description: "aria-level for the title; match the surrounding page",
    },
    {
      name: "(content)",
      type: "projected",
      default: "",
      description: "An optional single action button",
    },
  ];
  readonly importCode = `import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";`;
  readonly code = `<!-- no data, with a next step -->
<gt-empty-state
  icon="share_eta"
  title="No uptime monitors"
  message="Add a monitor to get alerted when a site or service goes down."
>
  <button mat-flat-button color="primary">
    <mat-icon>add</mat-icon>
    Add monitor
  </button>
</gt-empty-state>

<!-- no data, action lives elsewhere -->
<gt-empty-state
  icon="rocket_launch"
  title="No releases"
  message="Releases appear here once you send release data with your events."
/>`;
}
