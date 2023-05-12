import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { ReleasesRoutingModule } from "./releases-routing.module";
import { ReleasesComponent } from "./releases.component";
import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { ReleaseDetailComponent } from "./release-detail/release-detail.component";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [ReleasesComponent, ReleaseDetailComponent],
  imports: [
    CommonModule,
    ReleasesRoutingModule,
    ListFooterModule,
    ListTitleModule,
    MatTableModule,
    MaterialModule,
  ],
})
export class ReleasesModule {}
