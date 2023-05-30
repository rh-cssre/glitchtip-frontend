import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { MarkdownModule } from "ngx-markdown";

@Component({
  standalone: true,
  selector: "gt-lazy-markdown",
  templateUrl: "./lazy-markdown.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownModule],
})
export class LazyMarkdownComponent {
  @Input() markdownSrc: string | null = null;
}
