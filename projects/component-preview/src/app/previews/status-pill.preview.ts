import { Component, ChangeDetectionStrategy } from "@angular/core";
import { StatusPillComponent } from "src/app/shared/status-pill/status-pill.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-status-pill",
  imports: [StatusPillComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .sp-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--gt-space-3);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Status pill"
      status="stable"
      description="A record's current state as a short word in a grey pill with a colored dot: a monitor's Up or Down. The same pill appears wherever that state is shown, in lists and in page headers."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The state is always written out, so it is never conveyed by color alone. The pill is not interactive and takes no focus."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Monitor states</div>
        <div class="sp-row">
          <gt-status-pill label="Up" color="var(--success-color)" />
          <gt-status-pill label="Down" color="var(--mat-sys-error)" />
          <gt-status-pill label="No data" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class StatusPillPreview {
  readonly whenToUse = [
    "Showing a record's current state from a small fixed set (Up, Down, No data)",
  ];
  readonly dos = [
    "Use the same pill and color for a state in lists and in headers",
    "Pass a role token as the color so it follows the theme",
    "Show one status pill per record",
  ];
  readonly donts = [
    "Make it clickable; use a button or a filter chip for actions",
    "Use it for counts, tags or categories",
  ];
  readonly api: ApiRow[] = [
    {
      name: "label",
      type: "string",
      default: "",
      description: "The state, written out (required)",
    },
    {
      name: "color",
      type: "string",
      default: '"var(--mat-sys-outline)"',
      description: "CSS color for the dot; use a role token",
    },
  ];
  readonly importCode = `import { StatusPillComponent } from "src/app/shared/status-pill/status-pill.component";`;
  readonly code = `<gt-status-pill label="Down" color="var(--mat-sys-error)" />`;
}
