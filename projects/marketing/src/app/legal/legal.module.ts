import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrivacyComponent } from "./privacy/privacy.component";
import { LegalRoutingModule } from "./legal-routing.module";
import { MatCardModule } from "@angular/material";

@NgModule({
  declarations: [PrivacyComponent],
  imports: [CommonModule, LegalRoutingModule, MatCardModule]
})
export class LegalModule {}
