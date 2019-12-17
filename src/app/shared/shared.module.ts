import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
  declarations: [MainNavComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  exports: [MainNavComponent]
})
export class SharedModule {}
