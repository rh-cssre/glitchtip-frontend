import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

interface Tag {
  key: string;
  value: string;
  share?: string;
}

@Component({
  selector: "preview-tag-chip",
  imports: [PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="Tag chip"
      status="stable"
      description="A tag as a hairline pill: the key muted, the value bold, and an optional share after a middle dot. Usually a link that filters the issue list by that tag."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="A chip that filters is a link, so it is a tab stop with a focus ring and its text is its name. The middle dot is drawn by CSS, so it is not read out."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Default</div>
        <ul class="gt-tag-chips">
          @for (t of tags; track t.key) {
            <li>
              <a class="gt-tag-chip" href="#">
                <span class="gt-tag-chip__key">{{ t.key }}</span>
                <span class="gt-tag-chip__value">{{ t.value }}</span>
                @if (t.share) {
                  <span class="gt-tag-chip__share">{{ t.share }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Compact, for a summary line</div>
        <ul class="gt-tag-chips">
          @for (t of summary; track t.key) {
            <li>
              <a class="gt-tag-chip gt-tag-chip--compact" href="#">
                <span class="gt-tag-chip__key">{{ t.key }}</span>
                <span class="gt-tag-chip__value">{{ t.value }}</span>
                <span class="gt-tag-chip__share">{{ t.share }}</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </preview-doc>
  `,
})
export class TagChipPreview {
  readonly tags: Tag[] = [
    { key: "environment", value: "production" },
    { key: "browser", value: "Firefox 131", share: "2 of 15" },
    { key: "release", value: "checkout@4.2.0" },
  ];
  readonly summary: Tag[] = [
    { key: "feature_flag", value: "checkout_v2", share: "93%" },
    { key: "os", value: "Windows", share: "71%" },
  ];

  readonly whenToUse = ["Showing a tag (key and value) anywhere"];
  readonly dos = [
    "Wrap several chips in a .gt-tag-chips list",
    "Put a share inside the chip in .gt-tag-chip__share",
    "Use --compact on a one-line summary",
  ];
  readonly donts = [
    "Type the middle dot into a translated string",
    "Show a tag as plain key: value text",
    "Colour a chip; tags are neutral",
  ];
  readonly api: ApiRow[] = [
    {
      name: ".gt-tag-chip",
      type: "class",
      description: "The pill, on an a or span",
    },
    {
      name: ".gt-tag-chip--compact",
      type: "class",
      description: "24px, label-medium",
    },
    {
      name: ".gt-tag-chip__key / __value / __share",
      type: "class",
      description: "Muted key, bold value, muted share after a dot",
    },
    {
      name: ".gt-tag-chips",
      type: "class",
      description: "Wrapping list of chips (ul > li)",
    },
  ];
  readonly code = `<ul class="gt-tag-chips">
  <li>
    <a class="gt-tag-chip" [routerLink]="..." [queryParams]="...">
      <span class="gt-tag-chip__key">browser</span>
      <span class="gt-tag-chip__value">Firefox 131</span>
      <span class="gt-tag-chip__share">2 of 15</span>
    </a>
  </li>
</ul>`;
}
