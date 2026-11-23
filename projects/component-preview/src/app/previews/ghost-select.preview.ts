import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import {
  GhostSelectComponent,
  GhostSelectOption,
} from "src/app/shared/ghost-select/ghost-select.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { SelectGhostDirective } from "src/app/shared/select-ghost.directive";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-ghost-select",
  imports: [
    GhostSelectComponent,
    PanelComponent,
    MatSelectModule,
    PreviewDocComponent,
    SelectGhostDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .gs-text {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Ghost select"
      status="stable"
      description="A view switch with no outline: the selected value and an arrow, 32px tall, with the grey state layer of a text button. It changes what you see, never the record."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The ariaLabel input is the select's accessible name, since the trigger only shows the value. Keyboard and screen reader behaviour come from mat-select."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">In a panel header</div>
        <gt-panel title="Exception" subtitle="ValueError">
          <gt-ghost-select
            slot="actions"
            ariaLabel="Frames"
            shortLabel="App"
            [options]="frames"
            [(value)]="frame"
          />
          <p class="gs-text">Showing {{ frame() }} frames.</p>
        </gt-panel>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">With a label in front</div>
        <span gtSelectGhost>
          <mat-select
            aria-label="Categories"
            [panelWidth]="null"
            hideSingleSelectionIndicator
            [(value)]="categoryValue"
          >
            <mat-select-trigger>
              <span class="gt-select-ghost__label">Categories</span>
              <span class="gt-select-ghost__value">{{ categoryValue() }}</span>
            </mat-select-trigger>
            @for (c of categories; track c) {
              <mat-option [value]="c">{{ c }}</mat-option>
            }
          </mat-select>
        </span>
      </div>
    </preview-doc>
  `,
})
export class GhostSelectPreview {
  readonly frames: GhostSelectOption[] = [
    { value: "app", label: "App frames" },
    { value: "full", label: "Full" },
    { value: "raw", label: "Raw" },
  ];
  readonly frame = signal("app");
  readonly categories = ["All", "http", "navigation", "ui.click"];
  readonly categoryValue = signal("All");

  readonly whenToUse = [
    "Switching a panel's view: App frames, Full or Raw; Formatted or Raw",
    "Picking a period or a filter in a bar or panel header",
  ];
  readonly dos = [
    "Give it an ariaLabel that names what it switches",
    "Set shortLabel when the panel can get narrow",
    "Put a muted .gt-select-ghost__label in front when the value alone is unclear",
  ];
  readonly donts = [
    "Use it for an action that changes the record; that is an outlined button",
    "Wrap it in a mat-form-field",
  ];
  readonly api: ApiRow[] = [
    {
      name: "options",
      type: "GhostSelectOption[]",
      description: "Values and labels (required)",
    },
    {
      name: "[(value)]",
      type: "string",
      description: "Selected value, two-way (required)",
    },
    {
      name: "ariaLabel",
      type: "string",
      description: "Accessible name (required)",
    },
    {
      name: "width",
      type: "number | null",
      default: "null",
      description: "Fixed width in px; long labels truncate",
    },
    {
      name: "shortLabel",
      type: "string",
      default: '""',
      description: "Trigger text in a bar or panel under 600px",
    },
  ];
  readonly importCode = `import { GhostSelectComponent } from "src/app/shared/ghost-select/ghost-select.component";`;
  readonly code = `<gt-ghost-select
  slot="actions"
  i18n-ariaLabel
  ariaLabel="Frames"
  [options]="frameOptions"
  [(value)]="frames"
/>`;
}
