import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";

import { NewOrganizationRoutingModule } from "./new-organization-routing.module";
import { NewOrganizationsComponent } from "./new-organization.component";

@NgModule({
  declarations: [NewOrganizationsComponent],
  imports: [
    CommonModule,
    NewOrganizationRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class NewOrganizationModule {}
