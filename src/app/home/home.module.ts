import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { ProjectListComponent } from "../shared/project-list/project-list.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, ProjectListComponent],
})
export class HomeModule {}
