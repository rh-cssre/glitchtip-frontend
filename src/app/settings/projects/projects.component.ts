import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  input,
} from "@angular/core";
import { ProjectCardComponent } from "../../shared/project-card/project-card.component";
import { EmptyProjectsComponent } from "../../shared/project-card/empty-projects/empty-projects.component";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { SettingsProjectsService } from "./projects.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";

@Component({
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    EmptyProjectsComponent,
    ProjectCardComponent,
    DatePipe,
    TopAppBar,
  ],
  providers: [SettingsProjectsService],
})
export class ProjectsComponent {
  private service = inject(SettingsProjectsService);
  private organizationsService = inject(OrganizationsService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  activeOrganization = this.organizationsService.activeOrganization;
  projects = this.service.projects;
  accessProjectWrite = this.organizationsService.accessProjectWrite;

  constructor() {
    effect(() => {
      this.service.orgSlug.set(this.orgSlug());
    });
  }
}
