import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "./material.module";

// Components
import { MainNavComponent } from "./main-nav/main-nav.component";

export const COMPONENTS = [MainNavComponent];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedModule {}
