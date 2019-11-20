import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "./form/input/input.component";
import { MatInputModule } from "@angular/material/input";

const COMPONENTS = [InputComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [CommonModule, MatInputModule]
})
export class SharedModule {}
