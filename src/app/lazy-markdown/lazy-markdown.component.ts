import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "gt-lazy-markdown",
  templateUrl: "./lazy-markdown.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyMarkdownComponent {
  @Input() markdownSrc: string | null = null;
}
