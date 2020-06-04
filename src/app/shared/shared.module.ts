import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material.module";
import { DaysAgoPipe } from "./days-ago.pipe";
import { ProjectCardComponent } from "./card/project-card/project-card.component";
import { CardComponent } from "./card/card.component";
import { RouterModule } from "@angular/router";
import { EntryDataComponent } from "./entry-data/entry-data.component";
import { EmptyProjectsComponent } from "./empty-projects/empty-projects.component";
import { InputMatcherDirective } from "./input-matcher.directive";
import { LoadingButtonComponent } from "./loading-button/loading-button.component";

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [
    DaysAgoPipe,
    ProjectCardComponent,
    EntryDataComponent,
    EmptyProjectsComponent,
    InputMatcherDirective,
    LoadingButtonComponent,
    CardComponent,
  ],
  exports: [
    DaysAgoPipe,
    ProjectCardComponent,
    EntryDataComponent,
    EmptyProjectsComponent,
    MaterialModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    CardComponent,
  ],
})
export class SharedModule {}
