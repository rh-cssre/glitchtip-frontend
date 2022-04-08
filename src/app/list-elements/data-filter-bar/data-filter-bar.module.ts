import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { DataFilterBarComponent } from "./data-filter-bar.component";


@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [DataFilterBarComponent],
  exports: [DataFilterBarComponent],
})
export class DataFilterBarModule {}
