import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReleasesRoutingModule } from "./releases-routing.module";
import { ListFooterComponent } from "../list-elements/list-footer/list-footer.component";
import { ListTitleComponent } from "../list-elements/list-title/list-title.component";

import { ReleasesComponent } from "./releases.component";
import { ReleaseDetailComponent } from "./release-detail/release-detail.component";


@NgModule({
    imports: [
        CommonModule,
        ReleasesRoutingModule,
        ListFooterComponent,
        ListTitleComponent,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        ReleasesComponent, ReleaseDetailComponent,
    ],
})
export class ReleasesModule {}
