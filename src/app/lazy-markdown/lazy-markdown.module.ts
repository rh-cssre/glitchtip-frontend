import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { LazyMarkdownComponent } from "./lazy-markdown.component";


@NgModule({
    imports: [CommonModule, MarkdownModule.forRoot({}), LazyMarkdownComponent],
    exports: [LazyMarkdownComponent],
})
export class LazyMarkdownModule {}
