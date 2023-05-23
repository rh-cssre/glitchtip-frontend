import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { ProjectListComponent } from "../shared/project-list/project-list.component";

@NgModule({
    imports: [CommonModule, HomeRoutingModule, ProjectListComponent, HomeComponent],
})
export class HomeModule {}
