import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material.module";
import { DaysAgoPipe } from "./days-ago.pipe";

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [DaysAgoPipe],
  exports: [DaysAgoPipe]
})
export class SharedModule {}
