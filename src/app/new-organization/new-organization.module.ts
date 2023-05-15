import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { NewOrganizationRoutingModule } from "./new-organization-routing.module";
import { NewOrganizationsComponent } from "./new-organization.component";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [NewOrganizationsComponent],
  imports: [
    CommonModule,
    NewOrganizationRoutingModule,
    LessAnnoyingErrorStateMatcherModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class NewOrganizationModule {}
