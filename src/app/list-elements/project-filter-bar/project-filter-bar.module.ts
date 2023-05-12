import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProjectFilterBarComponent } from "./project-filter-bar.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  declarations: [ProjectFilterBarComponent],
  exports: [ProjectFilterBarComponent],
})
export class ProjectFilterBarModule {}
