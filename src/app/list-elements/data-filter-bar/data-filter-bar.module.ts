import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DataFilterBarComponent } from "./data-filter-bar.component";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
  ],
  declarations: [DataFilterBarComponent],
  exports: [DataFilterBarComponent],
})
export class DataFilterBarModule {}
