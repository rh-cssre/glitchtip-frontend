import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";
import Prism from "prismjs";
import { PRISM_SUPPORTED_GRAMMER } from "./constants";

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
      if (PRISM_SUPPORTED_GRAMMER.includes(language)) {
        const grammar = Prism.languages[language];
        const html = Prism.highlight(code, grammar, language);
        this.el.nativeElement.innerHTML = html;

        setTimeout(() => Prism.highlightAll())  // Necessary for prism plugins
      }
    }
  }
}
