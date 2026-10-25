import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  inject,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTabsModule,
    RouterLinkActive,
    RouterOutlet,
    PageHeaderComponent,
    BackLinkComponent,
    TopAppBar,
    DatePipe,
  ],
})
export class TeamDetailsComponent {
  orgSlug = input.required<string>({ alias: "org-slug" });
  teamSlug = input.required<string>({ alias: "team-slug" });
  navLinks = [
    {
      path: "members",
      label: $localize`Members`,
    },
    {
      path: "projects",
      label: $localize`Projects`,
    },
    {
      path: "settings",
      label: $localize`Settings`,
    },
  ];

  private organizationsService = inject(OrganizationsService);
  #params = computed(() => ({ org: this.orgSlug(), team: this.teamSlug() }));
  #teamResource = apiResource(this.#params, (params) => ({
    url: "/api/0/teams/{organization_id_or_slug}/{team_slug}/",
    options: {
      params: {
        path: {
          ...this.organizationsService.orgPath(params.org),
          team_slug: params.team,
        },
      },
    },
  }));
  #projectsResource = apiResource(this.#params, (params) => ({
    url: "/api/0/teams/{organization_id_or_slug}/{team_slug}/projects/",
    options: {
      params: {
        path: {
          ...this.organizationsService.orgPath(params.org),
          team_slug: params.team,
        },
      },
    },
  }));
  team = computed(() => this.#teamResource.value());
  tabCounts = computed<Record<string, number | undefined>>(() => ({
    members: this.team()?.memberCount,
    projects: this.#projectsResource.value()?.length,
  }));
}
