import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SharedModule } from "../shared/shared.module";
import { ListActionsComponent } from "./list-actions/list-actions.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [ListActionsComponent],
  exports: [ListActionsComponent],
})
export class ListElementsModule {}
