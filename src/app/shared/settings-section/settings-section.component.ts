import { ChangeDetectionStrategy, Component, input } from "@angular/core";

let nextId = 0;

@Component({
  selector: "gt-settings-section",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class.inline]": "inline()", "[attr.title]": "null" },
  template: `
    <div class="settings-section__text">
      <h2 class="settings-section__title" [id]="titleId">{{ title() }}</h2>
      <div class="settings-section__description gt-prose">
        <ng-content select="[slot=description]" />
      </div>
    </div>
    <div class="settings-section__content">
      <div class="settings-section__body">
        <ng-content />
      </div>
      <div class="settings-section__error">
        <ng-content select="[slot=error]" />
      </div>
      <div class="settings-section__actions">
        <ng-content select="[slot=actions]" />
      </div>
    </div>
  `,
  styleUrl: "./settings-section.component.scss",
})
export class SettingsSectionComponent {
  readonly title = input.required<string>();
  readonly inline = input(false);
  readonly titleId = `gt-settings-section-${nextId++}`;
}
