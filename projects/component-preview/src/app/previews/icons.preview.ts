import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { iconDictionary } from "src/app/shared/shared.utils";

/**
 * Renders every entry in the app's `iconDictionary` (browser, OS and framework
 * logos sourced from the @browser-logos / operating-system-logos npm packages
 * and local assets). When one of those packages is upgraded and an asset path
 * changes, the corresponding image 404s — this view surfaces that instantly:
 * broken icons are highlighted in red, and a running count is shown. Flip the
 * toolbar's light/dark toggle to check icon contrast in both schemes.
 */
@Component({
  selector: "preview-icons",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 12px;
      }
      .icon-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px 6px;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        text-align: center;
        background-color: var(--mat-sys-surface-container-low);
      }
      .icon-cell img {
        width: 40px;
        height: 40px;
        object-fit: contain;
      }
      .icon-cell--broken {
        border-color: var(--mat-sys-error);
        background-color: color-mix(
          in srgb,
          var(--mat-sys-error) 14%,
          transparent
        );
      }
      .icon-cell__name {
        font: var(--mat-sys-label-small);
        word-break: break-word;
      }
      .icon-summary {
        margin-bottom: 16px;
        font: var(--mat-sys-body-medium);
      }
      .icon-summary--bad {
        color: var(--mat-sys-error);
        font-weight: bold;
      }
    `,
  ],
  template: `
    <div
      class="icon-summary"
      [class.icon-summary--bad]="broken().length > 0"
    >
      {{ entries.length }} icons —
      @if (broken().length === 0) {
        all loaded ✓
      } @else {
        {{ broken().length }} failed to load: {{ broken().join(", ") }}
      }
    </div>

    <div class="icon-grid">
      @for (entry of entries; track entry.name) {
        <div class="icon-cell" [class.icon-cell--broken]="isBroken(entry.name)">
          <img
            [src]="entry.path"
            [alt]="entry.name"
            (error)="markBroken(entry.name)"
          />
          <span class="icon-cell__name">{{ entry.name }}</span>
        </div>
      }
    </div>
  `,
})
export class IconsPreview {
  readonly entries = Object.entries(iconDictionary).map(([name, path]) => ({
    name,
    path,
  }));

  private readonly brokenSet = signal<ReadonlySet<string>>(new Set());
  readonly broken = signal<string[]>([]);

  isBroken(name: string): boolean {
    return this.brokenSet().has(name);
  }

  markBroken(name: string): void {
    const next = new Set(this.brokenSet());
    next.add(name);
    this.brokenSet.set(next);
    this.broken.set([...next]);
  }
}
