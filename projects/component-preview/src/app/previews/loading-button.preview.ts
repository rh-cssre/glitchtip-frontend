import { Component, ChangeDetectionStrategy } from "@angular/core";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";

@Component({
  selector: "preview-loading-button",
  imports: [LoadingButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `,
})
export class LoadingButtonPreview {}
