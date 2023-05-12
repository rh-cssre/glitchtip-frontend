import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { ReleasesRoutingModule } from "./releases-routing.module";
import { ReleasesComponent } from "./releases.component";
import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { ReleaseDetailComponent } from "./release-detail/release-detail.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [ReleasesComponent, ReleaseDetailComponent],
  imports: [
    CommonModule,
    ReleasesRoutingModule,
    ListFooterModule,
    ListTitleModule,
    MatTableModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class ReleasesModule {}
