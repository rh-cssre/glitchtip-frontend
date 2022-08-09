import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismDirective } from "./prism.directive";

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
