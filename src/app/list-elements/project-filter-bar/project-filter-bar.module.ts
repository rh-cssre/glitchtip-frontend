import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProjectFilterBarComponent } from "./project-filter-bar.component";
import { MaterialModule } from "src/app/shared/material.module";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [ProjectFilterBarComponent],
  exports: [ProjectFilterBarComponent],
})
export class ProjectFilterBarModule {}
