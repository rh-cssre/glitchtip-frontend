import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MobileNavToolbarComponent } from "./mobile-nav-toolbar.component";

@NgModule({
    imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MobileNavToolbarComponent],
    exports: [MobileNavToolbarComponent],
})
export class MobileNavToolbarModule {}
