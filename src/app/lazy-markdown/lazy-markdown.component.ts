import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { NgIf } from "@angular/common";

@Component({
    selector: "gt-lazy-markdown",
    templateUrl: "./lazy-markdown.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MarkdownModule],
})
export class LazyMarkdownComponent {
  @Input() markdownSrc: string | null = null;
}
