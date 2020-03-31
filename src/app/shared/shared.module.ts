import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material.module";
import { DaysAgoPipe } from "./days-ago.pipe";
import { ProjectCardComponent } from "./project-card/project-card.component";
import { RouterModule } from "@angular/router";
import { EntryDataComponent } from "./entry-data/entry-data.component";

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [DaysAgoPipe, ProjectCardComponent, EntryDataComponent],
  exports: [
    DaysAgoPipe,
    ProjectCardComponent,
    EntryDataComponent,
    MaterialModule
  ]
})
export class SharedModule {}
