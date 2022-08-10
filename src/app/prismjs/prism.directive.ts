import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from "@angular/core";
import Prism from "prismjs";
import { GRAMMER_MAPPINGS, PRISM_SUPPORTED_GRAMMER } from "./constants";

@Directive({
  selector: "[gtPrism]",
})
export class PrismDirective implements AfterViewInit, OnInit {
  @Input() code?: string;
  @Input() language?: string;
  @HostBinding("class") elementClass = "";

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const language = this.getLanguage();
    if (language) {
      this.elementClass = `language-${language}`;
    }
  }

  ngAfterViewInit() {
    const language = this.getLanguage();
    if (language) {
      const code = this.code || this.el.nativeElement.innerText;
      if (PRISM_SUPPORTED_GRAMMER.includes(language)) {
        const grammar = Prism.languages[language];
        const html = Prism.highlight(code, grammar, language);
        this.el.nativeElement.innerHTML = html;

        Prism.highlightElement(this.el.nativeElement); // Necessary for prism plugins
      }
    }
  }

  getLanguage() {
    let language = this.language;
    if (language && language in GRAMMER_MAPPINGS) {
      language = GRAMMER_MAPPINGS[language] as string;
    }
    return language;
  }
}
