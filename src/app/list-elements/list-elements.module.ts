import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { ListActionsComponent } from "./list-actions/list-actions.component";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ListActionsComponent],
  exports: [ListActionsComponent],
})
export class ListElementsModule {}
