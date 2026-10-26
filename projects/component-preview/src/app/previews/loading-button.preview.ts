import { Component, ChangeDetectionStrategy } from "@angular/core";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { ApiRow, KeyRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-loading-button",
  imports: [LoadingButtonComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="Loading button"
      status="stable"
      description="A button that shows an inline spinner and disables itself while an async action is in flight, preventing double-submits. Use it for any action that triggers a request."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The spinner replaces the label while loading; keep buttonText set so screen readers still announce the action. Disabled state is conveyed via the native disabled attribute."
      [keyboard]="keyboard"
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Styles</div>
        <div class="preview-row">
          <gt-loading-button buttonText="Flat" buttonStyle="flat" />
          <gt-loading-button buttonText="Stroked" buttonStyle="stroked" />
          <gt-loading-button buttonText="Basic" buttonStyle="basic" />
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Colors</div>
        <div class="preview-row">
          <gt-loading-button buttonText="Primary" color="primary" />
          <gt-loading-button buttonText="Warn" color="warn" />
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">States</div>
        <div class="preview-row">
          <gt-loading-button buttonText="Loading" [loading]="true" />
          <gt-loading-button buttonText="Disabled" [disabled]="true" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class LoadingButtonPreview {
  readonly whenToUse = [
    "Submitting a form or triggering an API call",
    "Any action where a second click before completion would cause a duplicate request",
  ];
  readonly dos = [
    "Bind [loading] to the request's in-flight state",
    "Keep buttonText meaningful so the action is announced",
  ];
  readonly donts = [
    "Use it for pure navigation with no async work",
    "Leave it in the loading state after the request settles",
  ];
  readonly keyboard: KeyRow[] = [
    { keys: "Enter / Space", description: "Activates the button (emits buttonClick) when not loading or disabled" },
    { keys: "Tab", description: "Moves focus to the button; skipped while disabled" },
  ];
  readonly anatomy = `<gt-loading-button [loading]="..." (buttonClick)="...">`;
  readonly composition = {
    within: ["Forms", "Table"],
  };
  readonly api: ApiRow[] = [
    { name: "buttonText", type: "string", default: "", description: "Label shown on the button" },
    { name: "buttonStyle", type: `"flat" | "stroked" | "basic"`, default: `"flat"`, description: "Material button variant" },
    { name: "color", type: `"primary" | "warn"`, default: `"primary"`, description: "Theme color role" },
    { name: "loading", type: "boolean", default: "false", description: "Shows the spinner and disables the button" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables the button" },
    { name: "fullWidth", type: "boolean", default: "false", description: "Stretches the button to its container width" },
    { name: "(buttonClick)", type: "output", default: "", description: "Emits when the button is activated" },
  ];
  readonly importCode = `import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";`;
  readonly code = `<gt-loading-button
  buttonText="Save"
  buttonStyle="flat"
  color="primary"
  [loading]="saving()"
  (buttonClick)="save()"
/>`;
}
