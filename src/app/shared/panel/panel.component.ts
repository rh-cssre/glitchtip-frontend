import {
  ChangeDetectionStrategy,
  Component,
  input,
  booleanAttribute,
  numberAttribute,
} from "@angular/core";

let nextId = 0;

/** Container for charts and data blocks. Settings, forms and lists stay card-less. */
@Component({
  selector: "gt-panel",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./panel.component.html",
  styleUrl: "./panel.component.scss",
  host: {
    "[attr.title]": "null",
    "[attr.role]": "title() ? 'region' : null",
    "[attr.aria-labelledby]": "title() ? titleId : null",
  },
})
export class PanelComponent {
  readonly title = input<string>("");
  readonly headingLevel = input(2, { transform: numberAttribute });
  /** Body runs edge to edge, for content that draws its own rows. */
  readonly flush = input(false, { transform: booleanAttribute });

  readonly titleId = `gt-panel-title-${nextId++}`;
}
