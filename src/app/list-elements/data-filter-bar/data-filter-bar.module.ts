import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DataFilterBarComponent } from "./data-filter-bar.component";
import { MaterialModule } from "src/app/shared/material.module";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [DataFilterBarComponent],
  exports: [DataFilterBarComponent],
})
export class DataFilterBarModule {}
