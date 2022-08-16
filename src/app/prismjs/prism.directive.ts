import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";
import Prism from "prismjs";

const SUPPORTED_GRAMMER = [
  "javascript",
  "csharp",
  "python",
  "java",
  "ruby",
  "php",
  "go",
  "rust",
];

const GRAMMER_MAPPINGS: { [key: string]: string } = { node: "javascript" };

@Directive({
  selector: "[gtPrism]",
})
export class PrismDirective implements AfterViewInit {
  @Input() code?: string;
  @Input() language? = "javascript";
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    let language = this.language;
    if (language) {
      if (language in GRAMMER_MAPPINGS) {
        language = GRAMMER_MAPPINGS[language] as string;
      }
      const code = this.code || this.el.nativeElement.innerText;
      if (SUPPORTED_GRAMMER.includes(language)) {
        const grammar = Prism.languages[language];
        const html = Prism.highlight(code, grammar, language);
        this.el.nativeElement.innerHTML = html;
      }
    }
  }
}
