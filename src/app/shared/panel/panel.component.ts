import {
  ChangeDetectionStrategy,
  Component,
  input,
  booleanAttribute,
  numberAttribute,
} from "@angular/core";

let nextId = 0;

export type PanelTone = "default" | "danger";

/** Container for charts, data blocks and settings save units. */
@Component({
  selector: "gt-panel",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./panel.component.html",
  styleUrl: "./panel.component.scss",
  host: {
    "[attr.title]": "null",
    "[attr.role]": "title() ? 'region' : null",
    "[attr.aria-labelledby]": "title() ? titleId : null",
    "[class.gt-panel--danger]": "tone() === 'danger'",
  },
})
export class PanelComponent {
  readonly title = input<string>("");
  readonly headingLevel = input(2, { transform: numberAttribute });
  /** Body runs edge to edge, for content that draws its own rows. */
  readonly flush = input(false, { transform: booleanAttribute });
  /** Danger tints the border, for a destructive save unit like Delete. */
  readonly tone = input<PanelTone>("default");

  readonly titleId = `gt-panel-title-${nextId++}`;
}
