import { ChangeDetectionStrategy, Component, Input } from "@angular/core";


@Component({
  standalone: true,
  selector: "gt-list-title",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: "./list-title.component.html",
  styleUrls: ["./list-title.component.scss"],
})
export class ListTitleComponent {
  @Input() searchHits?: string;
  @Input() title?: string;
}
