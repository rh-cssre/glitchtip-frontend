import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SharedModule } from "src/app/shared/shared.module";
import { DataFilterBarComponent } from "./data-filter-bar.component";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [DataFilterBarComponent],
  exports: [DataFilterBarComponent],
})
export class DataFilterBarModule {}
