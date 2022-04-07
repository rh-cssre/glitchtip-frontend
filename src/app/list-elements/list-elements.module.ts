import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { HeaderNavComponent } from "./header-nav/header-nav.component";
import { ListActionsComponent } from "./list-actions/list-actions.component";


@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [ListActionsComponent, HeaderNavComponent],
  exports: [ListActionsComponent, HeaderNavComponent],
})
export class ListElementsModule {}
