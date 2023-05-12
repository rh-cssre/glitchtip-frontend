import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { NewOrganizationRoutingModule } from "./new-organization-routing.module";
import { NewOrganizationsComponent } from "./new-organization.component";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [NewOrganizationsComponent],
  imports: [
    CommonModule,
    NewOrganizationRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class NewOrganizationModule {}
