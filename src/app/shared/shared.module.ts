/**
 * Common modules used in many places. This module is still lazy loaded.
 * SharedModule depends on MaterialModule.
 * You should import only MaterialModule if you don't need SharedModule
 * Importing SharedModule also imports MaterialModule. Do not explicitly import both.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "./material.module";
import { DaysAgoPipe, DaysOldPipe } from "./days-ago.pipe";
import { ProjectCardComponent } from "./project-card/project-card.component";
import { EntryDataComponent } from "./entry-data/entry-data.component";
import { EmptyProjectsComponent } from "./project-card/empty-projects/empty-projects.component";
import { InputMatcherDirective } from "./input-matcher.directive";
import { LoadingButtonComponent } from "./loading-button/loading-button.component";
import { AuthSvgComponent } from "./auth-svg/auth-svg.component";
import { ProjectListComponent } from "./project-list/project-list.component";

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [
    DaysAgoPipe,
    DaysOldPipe,
    ProjectCardComponent,
    EntryDataComponent,
    EmptyProjectsComponent,
    InputMatcherDirective,
    LoadingButtonComponent,
    AuthSvgComponent,
    ProjectListComponent,
  ],
  exports: [
    DaysAgoPipe,
    DaysOldPipe,
    ProjectCardComponent,
    EntryDataComponent,
    EmptyProjectsComponent,
    MaterialModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    AuthSvgComponent,
    ProjectListComponent,
  ],
})
export class SharedModule {}
