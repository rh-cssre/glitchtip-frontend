/**
 * Common modules used in many places. This module is still lazy loaded.
 * SharedModule depends on MaterialModule.
 * You should import only MaterialModule if you don't need SharedModule
 * Importing SharedModule also imports MaterialModule. Do not explicitly import both.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "./material.module";
import { DaysAgoPipe, DaysOldPipe, TimeForPipe } from "./days-ago.pipe";
import { HumanizeDurationPipe } from "./seconds-or-ms.pipe";
import { ProjectCardComponent } from "./project-card/project-card.component";
import { EntryDataComponent } from "./entry-data/entry-data.component";
import { EmptyProjectsComponent } from "./project-card/empty-projects/empty-projects.component";
import { InputMatcherDirective } from "./input-matcher.directive";
import { LoadingButtonComponent } from "./loading-button/loading-button.component";
import { AuthSvgComponent } from "./auth-svg/auth-svg.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { CopyInputComponent } from "./copy-input/copy-input.component";
import { ToDoItemComponent } from "./to-do-item/to-do-item.component";
import { FormErrorComponent } from "./forms/form-error/form-error.component";
import { EventInfoComponent } from "./event-info/event-info.component";

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule],
  declarations: [
    TimeForPipe,
    DaysAgoPipe,
    DaysOldPipe,
    HumanizeDurationPipe,
    ProjectCardComponent,
    EntryDataComponent,
    EmptyProjectsComponent,
    InputMatcherDirective,
    LoadingButtonComponent,
    AuthSvgComponent,
    ProjectListComponent,
    CopyInputComponent,
    ToDoItemComponent,
    FormErrorComponent,
    EventInfoComponent,
  ],
  exports: [
    TimeForPipe,
    DaysAgoPipe,
    DaysOldPipe,
    HumanizeDurationPipe,
    ProjectCardComponent,
    EntryDataComponent,
    EmptyProjectsComponent,
    MaterialModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    AuthSvgComponent,
    ProjectListComponent,
    CopyInputComponent,
    ToDoItemComponent,
    FormErrorComponent,
    EventInfoComponent,
  ],
})
export class SharedModule {}
