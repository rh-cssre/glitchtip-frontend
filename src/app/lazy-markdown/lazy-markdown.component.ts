import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from "@angular/core";

import "node_modules/prismjs/prism.js";
import "node_modules/prismjs/components/prism-csharp.min.js";
import "node_modules/prismjs/components/prism-python.min.js";
import "node_modules/prismjs/components/prism-java.min.js";
import "node_modules/prismjs/components/prism-ruby.min.js";
import "node_modules/prismjs/components/prism-markup-templating.min.js";
import "node_modules/prismjs/components/prism-php.min.js";
import "node_modules/prismjs/components/prism-go.min.js";
import "node_modules/prismjs/components/prism-rust.min.js";

@Component({
  selector: "gt-lazy-markdown",
  templateUrl: "./lazy-markdown.component.html",
  styleUrls: ["./lazy-markdown.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyMarkdownComponent {
  @Input() markdownSrc: string | null = null;
}
