import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from "@angular/core";
import Prism from "prismjs";
import { GRAMMAR_MAPPINGS, PRISM_SUPPORTED_GRAMMAR } from "./constants";

import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";

@Directive({
  selector: "[gtPrism]",
  standalone: true,
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
      if (PRISM_SUPPORTED_GRAMMAR.includes(language)) {
        const grammar = Prism.languages[language];
        const html = Prism.highlight(code, grammar, language);
        this.el.nativeElement.innerHTML = html;

        Prism.highlightElement(this.el.nativeElement); // Necessary for prism plugins
      }
    }
  }

  getLanguage() {
    let language = this.language;
    if (language && language in GRAMMAR_MAPPINGS) {
      language = GRAMMAR_MAPPINGS[language] as string;
    }
    return language;
  }
}
