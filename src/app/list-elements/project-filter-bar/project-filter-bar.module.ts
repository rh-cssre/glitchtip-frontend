import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { ProjectFilterBarComponent } from "./project-filter-bar.component";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [ProjectFilterBarComponent],
  exports: [ProjectFilterBarComponent],
})
export class ProjectFilterBarModule {}
