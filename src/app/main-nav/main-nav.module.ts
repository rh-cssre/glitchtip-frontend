import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { MainNavComponent } from "../main-nav/main-nav/main-nav.component";
import { MaterialModule } from "../shared/material.module";

const routes: Routes = [
  {
    path: "",
    component: MainNavComponent
    // children: [{ path: "", component:  }]
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
  declarations: [MainNavComponent],
  exports: [MainNavComponent]
})
export class MainNavModule {}
