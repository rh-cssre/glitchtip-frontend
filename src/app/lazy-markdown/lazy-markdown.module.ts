import { NgModule } from "@angular/core";
import { NgIf } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { LazyMarkdownComponent } from "./lazy-markdown.component";


@NgModule({
    declarations: [LazyMarkdownComponent],
    imports: [NgIf, MarkdownModule.forRoot({})],
    exports: [LazyMarkdownComponent],
})
export class LazyMarkdownModule {}
