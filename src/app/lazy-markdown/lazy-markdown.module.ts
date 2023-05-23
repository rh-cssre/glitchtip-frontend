import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { LazyMarkdownComponent } from "./lazy-markdown.component";
import { PrismjsModule } from "../prismjs/prismjs.module";

@NgModule({
    imports: [CommonModule, MarkdownModule.forRoot({}), PrismjsModule, LazyMarkdownComponent],
    exports: [LazyMarkdownComponent],
})
export class LazyMarkdownModule {}
