import { Component, ChangeDetectionStrategy } from "@angular/core";
import { EntryDataComponent } from "src/app/shared/entry-data/entry-data.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * gt-entry-data: a single key/value row used across event and error detail
 * views to render structured event properties.
 */
@Component({
  selector: "preview-entry-data",
  imports: [EntryDataComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .ed-list {
        display: flex;
        flex-direction: column;
        max-width: 520px;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Entry data"
      status="stable"
      description="One key/value row of structured event data (browser, OS, request headers, tags). Event and error detail pages stack many of these to render an event's properties. An object value is shown as JSON, so a row never breaks on nested data."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Key and value are plain text in reading order, so a screen reader announces the label then its value. Long values wrap rather than truncate, so nothing is hidden."
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Event properties</div>
        <div class="ed-list">
          <gt-entry-data key="Browser" value="Firefox 141.0" />
          <gt-entry-data key="OS" value="macOS 15.5" />
          <gt-entry-data key="URL" value="https://app.glitchtip.com/issues" />
          <gt-entry-data key="Handled" [value]="false" />
          <gt-entry-data key="Tags" [value]="objectValue" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class EntryDataPreview {
  readonly objectValue = { environment: "production", release: "1.4.2" };

  readonly whenToUse = [
    "Rendering an event or error's structured properties on a detail page",
    "Any read-only key/value list where values can be strings, numbers, or objects",
  ];
  readonly dos = [
    "Pass the raw value; the component stringifies objects for you",
    "Keep keys short and consistent with the event schema",
    "Stack rows in a single column so keys and values line up",
  ];
  readonly donts = [
    "Pre-stringify an object; pass it and let the component format it",
    "Use it for editable fields; it is read-only display",
  ];
  readonly anatomy = `<gt-entry-data [key]="..." [value]="..." />`;
  readonly composition = {
    within: ["Detail page"],
  };
  readonly api: ApiRow[] = [
    { name: "key", type: "any", default: "", description: "The property label" },
    { name: "value", type: "any", default: "", description: "The value; objects are rendered as JSON" },
  ];
  readonly importCode = `import { EntryDataComponent } from "src/app/shared/entry-data/entry-data.component";`;
  readonly code = `@for (row of entry.data | keyvalue; track row.key) {
  <gt-entry-data [key]="row.key" [value]="row.value" />
}`;
}
