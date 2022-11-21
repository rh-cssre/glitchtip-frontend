import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";

import { ReleasesRoutingModule } from "./releases-routing.module";
import { ReleasesComponent } from "./releases.component";
import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { ReleaseDetailComponent } from "./release-detail/release-detail.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ReleasesComponent, ReleaseDetailComponent],
  imports: [
    CommonModule,
    ReleasesRoutingModule,
    ListFooterModule,
    ListTitleModule,
    MatTableModule,
    SharedModule,
  ],
})
export class ReleasesModule {}
