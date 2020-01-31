import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrivacyComponent } from "./privacy/privacy.component";
import { LegalRoutingModule } from "./legal-routing.module";

@NgModule({
  declarations: [PrivacyComponent],
  imports: [CommonModule, LegalRoutingModule]
})
export class LegalModule {}
