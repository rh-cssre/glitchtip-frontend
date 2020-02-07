import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { PrivacyComponent } from "./privacy/privacy.component";
import { LegalRoutingModule } from "./legal-routing.module";

@NgModule({
  declarations: [PrivacyComponent],
  imports: [CommonModule, LegalRoutingModule, MatCardModule]
})
export class LegalModule {}
