import { Component, ChangeDetectionStrategy, input } from "@angular/core";

/**
 * A labeled bullet list, the most repeated block in a preview page: When to
 * use, Do, Don't, and Writing all share this shape. `tone` colors the Do/Don't
 * variants (a green or red top rule and matching list markers) so the two read
 * as a matched pair; the default neutral tone is used for When to use and
 * Writing.
 */
@Component({
  selector: "doc-bullets",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
      .doc-block__label {
        font: var(--mat-sys-label-large);
        margin: 0 0 var(--gt-space-2);
      }
      .doc-list {
        margin: 0;
        // The app's global reset strips list markers off ul; restore them here
        // so the guidance lists read as real bullets, not indented text.
        list-style: disc outside;
        padding-left: var(--gt-space-5);
        font: var(--mat-sys-body-medium);
      }
      .doc-list li {
        margin-bottom: var(--gt-space-2);
        padding-left: var(--gt-space-1);
      }
      .doc-list--do li::marker {
        color: var(--success-color);
      }
      .doc-list--dont li::marker {
        color: var(--mat-sys-error);
      }
      .is-do,
      .is-dont {
        border-top: 2px solid var(--mat-sys-outline-variant);
        padding-top: var(--gt-space-3);
      }
      .is-do {
        border-top-color: var(--success-color);
      }
      .is-dont {
        border-top-color: var(--mat-sys-error);
      }
    `,
  ],
  template: `
    <div [class.is-do]="tone() === 'do'" [class.is-dont]="tone() === 'dont'">
      <p class="doc-block__label">{{ label() }}</p>
      <ul
        class="doc-list"
        [class.doc-list--do]="tone() === 'do'"
        [class.doc-list--dont]="tone() === 'dont'"
      >
        @for (item of items(); track item) {
          <li>{{ item }}</li>
        }
      </ul>
    </div>
  `,
})
export class DocBulletsComponent {
  readonly label = input.required<string>();
  readonly items = input<string[]>([]);
  readonly tone = input<"neutral" | "do" | "dont">("neutral");
}
