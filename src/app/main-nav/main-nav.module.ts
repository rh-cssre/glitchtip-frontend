import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { MainNavRoutingModule } from "./main-nav-routing.module";

// Not lazy loaded
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from "@angular/material";

@NgModule({
  declarations: [MainNavComponent],
  imports: [
    CommonModule,
    MainNavRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule
  ]
})
export class MainNavModule {}
