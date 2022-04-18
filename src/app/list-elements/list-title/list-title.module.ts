import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ListTitleComponent } from "./list-title.component";

@NgModule({
  imports: [CommonModule],
  declarations: [ListTitleComponent],
  exports: [ListTitleComponent],
})
export class ListTitleModule {}
