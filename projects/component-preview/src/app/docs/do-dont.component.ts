import { Component, ChangeDetectionStrategy, input } from "@angular/core";

/**
 * A paired do / don't visual example, in the style of published design systems
 * (Carbon, Polaris): two columns, each with a colored bar (success / error),
 * the live example projected in, and a short caption. Project the good example
 * into slot="do" and the bad one into slot="dont".
 */
@Component({
  selector: "preview-do-dont",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--gt-space-5);
        margin-bottom: var(--gt-space-5);
      }
      .dd-col {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        overflow: hidden;
      }
      .dd-bar {
        display: flex;
        align-items: center;
        gap: var(--gt-space-2);
        padding: var(--gt-space-2) var(--gt-space-3);
        font: var(--mat-sys-label-large);
        font-weight: 700;
      }
      .dd-bar--do {
        background-color: var(--success-container);
        color: var(--on-success);
      }
      .dd-bar--dont {
        background-color: color-mix(
          in srgb,
          var(--mat-sys-error) 16%,
          transparent
        );
        color: var(--mat-sys-error);
      }
      .dd-example {
        padding: var(--gt-space-5);
        background-color: var(--mat-sys-surface-container-low);
        min-height: 88px;
        display: flex;
        align-items: center;
        gap: var(--gt-space-3);
        flex-wrap: wrap;
      }
      .dd-caption {
        padding: var(--gt-space-3) var(--gt-space-3) var(--gt-space-4);
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <div class="dd-col">
      <div class="dd-bar dd-bar--do">Do</div>
      <div class="dd-example"><ng-content select="[slot=do]" /></div>
      @if (doCaption()) {
        <p class="dd-caption">{{ doCaption() }}</p>
      }
    </div>
    <div class="dd-col">
      <div class="dd-bar dd-bar--dont">Don't</div>
      <div class="dd-example"><ng-content select="[slot=dont]" /></div>
      @if (dontCaption()) {
        <p class="dd-caption">{{ dontCaption() }}</p>
      }
    </div>
  `,
})
export class DoDontComponent {
  readonly doCaption = input<string>("");
  readonly dontCaption = input<string>("");
}
