import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material.module";
import { DateAgoPipe } from "./date-ago.pipe";

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [DateAgoPipe],
  exports: [DateAgoPipe]
})
export class SharedModule {}
