import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { SettingsComponent } from "./settings/settings.component";
import { OrganizationComponent } from "./organization/organization.component";
import { TeamsComponent } from "./teams/teams.component";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MembersComponent } from "./members/members.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";

const routes: Routes = [
  {
    path: ":org-slug",
    component: SettingsComponent,
    children: [
      { path: "", component: OrganizationComponent },
      { path: "projects", component: ProjectsComponent },
      { path: "projects/new", component: NewProjectComponent },
      { path: "projects/:slug", component: ProjectDetailComponent },
      {
        path: "subscription",
        loadChildren: () =>
          import("./subscription/subscription.module").then(
            (m) => m.SubscriptionModule
          ),
      },
      {
        path: "teams",
        children: [
          { path: "", component: TeamsComponent },
          { path: ":team-slug/members", component: TeamMembersComponent },
        ],
      },
      {
        path: "members",
        children: [
          { path: "", component: MembersComponent },
          { path: ":member-id", component: MemberDetailComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
