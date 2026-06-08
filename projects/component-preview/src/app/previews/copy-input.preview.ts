import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";

@Component({
  selector: "preview-copy-input",
  imports: [CopyInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview-section" style="max-width: 520px">
      <div class="preview-section__title">DSN field</div>
      <gt-copy-input
        placeholder="DSN"
        value="https://abc123@app.glitchtip.com/42"
      />
    </div>

    <div class="preview-section" style="max-width: 520px">
      <div class="preview-section__title">Empty</div>
      <gt-copy-input placeholder="Nothing to copy yet" value="" />
    </div>
  `,
})
export class CopyInputPreview {}
