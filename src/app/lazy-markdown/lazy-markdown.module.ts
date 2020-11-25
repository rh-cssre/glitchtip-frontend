import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { LazyMarkdownComponent } from "./lazy-markdown.component";

@NgModule({
  declarations: [LazyMarkdownComponent],
  imports: [CommonModule, MarkdownModule.forRoot({})],
  exports: [LazyMarkdownComponent],
})
export class LazyMarkdownModule {}
