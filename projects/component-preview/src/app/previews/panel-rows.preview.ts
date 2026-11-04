import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-panel-rows",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PanelComponent,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .pr-stack {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-4, 16px);
      }

      .pr-frame {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--gt-space-3, 12px);
        padding: var(--gt-space-2, 8px) var(--gt-space-4, 16px);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Panel rows"
      status="stable"
      description="Rows for flush data panels from _panel-rows.scss: key/value rows, expandable rows, property lists, raw text and a plain end row. Rows are split by hairlines, never boxed. Under a 480px panel the label column narrows and long values go under their label."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="An expandable row is a native button with aria-expanded, so it is one tab stop and announces its state; the chevron is aria-hidden. A .gt-has-tip value takes tabindex 0 so its tooltip opens from the keyboard, with a focus ring."
      [api]="api"
      [code]="code"
      [widthToggle]="true"
    >
      <div class="preview-section">
        <div class="preview-section__title"
          >Key/value rows and property lists</div
        >
        <div class="pr-stack">
          <gt-panel flush title="Request" subtitle="POST /checkout">
            <div class="gt-kv">
              <div class="gt-kv__row">
                <span class="gt-kv__k">URL</span>
                <span class="gt-kv__v gt-break">
                  <a class="gt-prose-link" href="#"
                    >https://shop.example.com/checkout</a
                  >
                </span>
              </div>
              <div class="gt-kv__group">
                <button
                  type="button"
                  class="gt-kv__row gt-expandable-row"
                  [attr.aria-expanded]="headersOpen()"
                  (click)="headersOpen.set(!headersOpen())"
                >
                  <span class="gt-kv__k"
                    >Headers<span class="gt-kv__count">3</span></span
                  >
                  <span class="gt-kv__v gt-truncate"
                    >Accept, Content-Type, User-Agent</span
                  >
                  <mat-icon class="gt-chev" aria-hidden="true"
                    >keyboard_arrow_right</mat-icon
                  >
                </button>
                @if (headersOpen()) {
                  <dl class="gt-property-list gt-property-list--nested">
                    @for (h of headers; track h.key) {
                      <div class="gt-property-list__row">
                        <dt class="gt-mono">{{ h.key }}</dt>
                        <dd class="gt-mono">{{ h.value }}</dd>
                      </div>
                    }
                  </dl>
                }
              </div>
            </div>
          </gt-panel>

          <gt-panel flush title="Event">
            <dl class="gt-property-list gt-property-list--facts">
              <div class="gt-property-list__row">
                <dt>Release</dt>
                <dd class="gt-mono">checkout&#64;4.2.0</dd>
              </div>
              <div class="gt-property-list__row">
                <dt>Received</dt>
                <dd>
                  <span
                    class="gt-has-tip"
                    tabindex="0"
                    matTooltip="Oct 27, 2026, 9:14:03 PM"
                    >2 minutes ago</span
                  >
                </dd>
              </div>
              <div class="gt-property-list__row">
                <dt>Browser</dt>
                <dd>Firefox 131</dd>
              </div>
            </dl>
            <div class="gt-panel-row">
              <button mat-button type="button">Show all 7</button>
            </div>
          </gt-panel>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Raw text and a file path</div>
        <div class="pr-stack">
          <gt-panel flush title="Message">
            <pre class="gt-raw gt-raw--wrap">{{ raw }}</pre>
          </gt-panel>
          <gt-panel flush title="Frame">
            <div class="pr-frame">
              <span class="gt-path gt-mono"
                >src/app/checkout/payment/pricing.service.ts</span
              >
              <span class="gt-lc">42:17</span>
            </div>
          </gt-panel>
        </div>
      </div>
    </preview-doc>
  `,
})
export class PanelRowsPreview {
  readonly headersOpen = signal(false);
  readonly headers = [
    { key: "Accept", value: "application/json" },
    { key: "Content-Type", value: "application/json" },
    {
      key: "User-Agent",
      value: "Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0",
    },
  ];
  readonly raw = `ValueError: price must be positive
  at applyDiscount (pricing.service.ts:42:17)`;

  readonly whenToUse = [
    "Data panels on record pages: request data, event facts, stack frames",
  ];
  readonly dos = [
    "Put rows in a flush gt-panel so they run edge to edge",
    "Make a whole row the button when it expands",
    'End a capped list with a .gt-panel-row ("Show all 7"), not a footer',
  ];
  readonly donts = [
    "Box or shade single rows",
    "Add a second chevron or a link inside an expandable row",
  ];
  readonly api: ApiRow[] = [
    {
      name: ".gt-kv > .gt-kv__row",
      type: "class",
      description:
        "Label, value and a 32px chevron slot; on a button it expands",
    },
    {
      name: ".gt-kv__k / __v / __count / __group",
      type: "class",
      description: "Muted key, value, count after the key, an expandable group",
    },
    {
      name: ".gt-expandable-row",
      type: "class",
      description: "A button row with a grey state layer and focus ring",
    },
    {
      name: ".gt-property-list",
      type: "class",
      description: "dl of .gt-property-list__row; --nested, --facts, --vars",
    },
    {
      name: ".gt-raw",
      type: "class",
      description: "Monospace pre; --wrap wraps long lines, --nested indents",
    },
    {
      name: ".gt-panel-row",
      type: "class",
      description: "Plain end row with a hairline",
    },
    {
      name: ".gt-mono / .gt-muted / .gt-truncate / .gt-break",
      type: "class",
      description: "Text bits for row content",
    },
    {
      name: ".gt-path / .gt-lc / .gt-has-tip",
      type: "class",
      description:
        "File path truncated from the left, line:col, a value with a tooltip",
    },
  ];
  readonly code = `<gt-panel flush i18n-title title="Request">
  <div class="gt-kv">
    <div class="gt-kv__row">
      <span class="gt-kv__k" i18n>URL</span>
      <span class="gt-kv__v gt-break">{{ url }}</span>
    </div>
    <button
      type="button"
      class="gt-kv__row gt-expandable-row"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
    >
      <span class="gt-kv__k" i18n>Headers</span>
      <span class="gt-kv__v gt-truncate">{{ summary }}</span>
      <mat-icon class="gt-chev" aria-hidden="true">keyboard_arrow_right</mat-icon>
    </button>
  </div>
</gt-panel>`;
}
