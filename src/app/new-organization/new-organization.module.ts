import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { NewOrganizationRoutingModule } from "./new-organization-routing.module";
import { NewOrganizationsComponent } from "./new-organization.component";

@NgModule({
  declarations: [NewOrganizationsComponent],
  imports: [
    CommonModule,
    NewOrganizationRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class NewOrganizationModule {}
