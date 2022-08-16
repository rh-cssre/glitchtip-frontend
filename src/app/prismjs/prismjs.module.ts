import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismDirective } from "./prism.directive";

import "node_modules/prismjs/components/prism-csharp.min.js";
import "node_modules/prismjs/components/prism-python.min.js";
import "node_modules/prismjs/components/prism-java.min.js";
import "node_modules/prismjs/components/prism-ruby.min.js";
import "node_modules/prismjs/components/prism-markup-templating.min.js";
import "node_modules/prismjs/components/prism-php.min.js";
import "node_modules/prismjs/components/prism-go.min.js";
import "node_modules/prismjs/components/prism-rust.min.js";

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
