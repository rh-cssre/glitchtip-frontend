import { Route } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { SettingsComponent } from "./settings/settings.component";
import { OrganizationComponent } from "./organization/organization.component";
import { TeamsComponent } from "./teams/teams.component";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MembersComponent } from "./members/members.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { NewMemberComponent } from "./members/new-member/new-member.component";
import { TeamProjectsComponent } from "./teams/team-projects/team-projects.component";
import { TeamDetailsComponent } from "./teams/team-details/team-details.component";
import { TeamSettingsComponent } from "./teams/team-settings/team-settings.component";

export default [
  {
    path: "",
    component: SettingsComponent,
    children: [
      { path: "", component: OrganizationComponent },
      { path: "projects", component: ProjectsComponent },
      { path: "projects/new", component: NewProjectComponent },
      { path: "projects/:project-slug", component: ProjectDetailComponent },
      {
        path: "subscription",
        loadChildren: () => import("./subscription/routes"),
      },
      {
        path: "teams",
        children: [
          { path: "", component: TeamsComponent },
          {
            path: ":team-slug",
            component: TeamDetailsComponent,
            children: [
              { path: "members", component: TeamMembersComponent },
              { path: "projects", component: TeamProjectsComponent },
              { path: "settings", component: TeamSettingsComponent },
            ],
          },
        ],
      },
      {
        path: "members",
        children: [
          { path: "", component: MembersComponent },
          { path: "new", component: NewMemberComponent },
          { path: ":member-id", component: MemberDetailComponent },
        ],
      },
    ],
  },
] as Route[];
