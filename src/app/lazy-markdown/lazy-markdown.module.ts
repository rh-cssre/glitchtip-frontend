import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { LazyMarkdownComponent } from "./lazy-markdown.component";
import { PrismjsModule } from "../prismjs/prismjs.module";

@NgModule({
  declarations: [LazyMarkdownComponent],
  imports: [CommonModule, MarkdownModule.forRoot({}), PrismjsModule],
  exports: [LazyMarkdownComponent],
})
export class LazyMarkdownModule {}
