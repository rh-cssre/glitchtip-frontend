import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismDirective } from "./prism.directive";

import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/components/prism-csharp.min.js";
import "prismjs/components/prism-python.min.js";
import "prismjs/components/prism-java.min.js";
import "prismjs/components/prism-ruby.min.js";
import "prismjs/components/prism-markup-templating.min.js";
import "prismjs/components/prism-php.min.js";
import "prismjs/components/prism-go.min.js";
import "prismjs/components/prism-rust.min.js";

@NgModule({
  declarations: [
    PrismDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrismDirective
  ]
})
export class PrismjsModule { }
