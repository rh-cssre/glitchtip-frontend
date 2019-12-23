import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainNavComponent } from "../main-nav/main-nav/main-nav.component";
import { MaterialModule } from "../shared/material.module";
import { MainNavRoutingModule } from "./main-nav-routing.module";

@NgModule({
  imports: [CommonModule, MaterialModule, MainNavRoutingModule],
  declarations: [MainNavComponent],
  exports: [MainNavComponent]
})
export class MainNavModule {}
