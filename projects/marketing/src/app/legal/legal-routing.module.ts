import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PrivacyComponent } from "./privacy/privacy.component";

const routes: Routes = [{ path: "privacy", component: PrivacyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalRoutingModule {}
