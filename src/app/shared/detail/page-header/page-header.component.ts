import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { StatusPillComponent } from "../../status-pill/status-pill.component";

@Component({
  selector: "gt-page-header",
  imports: [MatIconModule, StatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./page-header.component.html",
  styleUrl: "./page-header.component.scss",
  host: {
    "[attr.title]": "null",
    "[class.gt-page-header--compact]": "compact()",
    "[class.gt-page-header--inline-subtitle]": "inlineSubtitle()",
  },
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly status = input<string | null>(null);
  readonly statusColor = input("var(--mat-sys-outline)");
  /** One line for a settings page; data pages keep the full header. */
  readonly compact = input(false, { transform: booleanAttribute });
  /** Run the subtitle on after the title, wrapping under it only when it must. */
  readonly inlineSubtitle = input(false, { transform: booleanAttribute });
}
