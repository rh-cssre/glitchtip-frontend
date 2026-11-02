import { Component, ChangeDetectionStrategy, input } from "@angular/core";

/**
 * Reusable centered section header: an eyebrow label, a `.fancy` title, and an
 * optional muted subtitle. Gives marketing sections a consistent, premium
 * rhythm.
 *
 *   <mkt-section-header
 *     eyebrow="Cost calculator"
 *     title="What are you paying to watch your errors?"
 *     subtitle="Drag to your monthly event volume." />
 */
@Component({
  selector: "mkt-section-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-header">
      @if (eyebrow()) {
        <p class="marketing-eyebrow">{{ eyebrow() }}</p>
      }
      <h2 class="fancy marketing-subheading">{{ title() }}</h2>
      @if (subtitle()) {
        <p class="marketing-body subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styleUrl: "./section-header.component.scss",
})
export class SectionHeaderComponent {
  eyebrow = input("");
  title = input("");
  subtitle = input("");
}
