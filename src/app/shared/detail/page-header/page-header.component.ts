import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "gt-page-header",
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./page-header.component.html",
  styleUrl: "./page-header.component.scss",
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly titleMono = input(false);
  readonly icon = input<string | null>(null);
}
