import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NewOrganizationsComponent } from "./new-organization.component";

const routes: Routes = [{ path: "", component: NewOrganizationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewOrganizationRoutingModule {}
