import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";

import { MainNavComponent } from "./main-nav/main-nav.component";
import { MobileNavToolbarModule } from "../mobile-nav-toolbar/mobile-nav-toolbar.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        MobileNavToolbarModule,
        MainNavComponent,
    ],
    exports: [MainNavComponent],
})
export class MainNavModule {}
