import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  input,
} from "@angular/core";
import { ProjectRowsComponent } from "../../shared/project-list/project-rows.component";
import { PanelComponent } from "../../shared/panel/panel.component";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state.component";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { SettingsProjectsService } from "./projects.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";

@Component({
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    ProjectRowsComponent,
    PanelComponent,
    EmptyStateComponent,
    TopAppBar,
  ],
  providers: [SettingsProjectsService],
})
export class ProjectsComponent {
  noProjectsCanCreate = $localize`Create a project to start sending events.`;
  noProjectsAskOwner = $localize`Ask an organization owner, manager or admin to create one.`;
  private service = inject(SettingsProjectsService);
  private organizationsService = inject(OrganizationsService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  activeOrganization = this.organizationsService.activeOrganization;
  projects = this.service.projects;
  errors = this.service.errors;
  hasError = this.service.hasError;
  canWriteProject = this.organizationsService.canWriteProject;

  constructor() {
    effect(() => {
      this.service.orgSlug.set(this.orgSlug());
    });
  }
}
