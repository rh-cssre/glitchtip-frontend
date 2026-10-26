import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-copy-input",
  imports: [CopyInputComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="Copy input"
      status="stable"
      description="A read-only field paired with a copy-to-clipboard button. Use it to surface a value the user needs to copy verbatim, such as a DSN, API key, or ID."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The copy button has a tooltip label so its purpose is announced. The field is read-only, not disabled, so the value stays selectable and reachable by screen readers."
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section preview-narrow">
        <div class="preview-section__title">DSN field</div>
        <gt-copy-input
          placeholder="DSN"
          value="https://abc123@app.glitchtip.com/42"
        />
      </div>

      <div class="preview-section preview-narrow">
        <div class="preview-section__title">Empty</div>
        <gt-copy-input placeholder="Nothing to copy yet" value="" />
      </div>
    </preview-doc>
  `,
})
export class CopyInputPreview {
  readonly whenToUse = [
    "Showing a value the user must copy exactly (DSN, token, ID)",
    "Any read-only string worth a one-click copy affordance",
  ];
  readonly dos = [
    "Set a placeholder that names the value",
  ];
  readonly donts = [
    "Use it for editable input (it is read-only by design)",
    "Rely on it for secrets that should never be displayed",
  ];
  readonly anatomy = `<gt-copy-input [value]="..." placeholder="..." />`;
  readonly composition = {
    within: ["Detail page"],
  };
  readonly api: ApiRow[] = [
    { name: "value", type: "string", default: `""`, description: "The value shown and copied" },
    { name: "placeholder", type: "string", default: `""`, description: "Placeholder / field label" },
  ];
  readonly importCode = `import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";`;
  readonly code = `<gt-copy-input
  placeholder="DSN"
  [value]="project.dsn"
/>`;
}
