import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SettingsRoutingModule } from "./settings-routing.module";
import { MobileNavToolbarModule } from "../mobile-nav-toolbar/mobile-nav-toolbar.module";

// Material
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { MatExpansionModule } from "@angular/material/expansion";

// Components
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationComponent } from "./organization/organization.component";
import { SettingsComponent } from "./settings/settings.component";
import { TeamsComponent } from "./teams/teams.component";
import { NewTeamComponent } from "./teams/new-team/new-team.component";
import { TeamProjectsComponent } from "./teams/team-projects/team-projects.component";
import { TeamDetailsComponent } from "./teams/team-details/team-details.component";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MembersComponent } from "./members/members.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { NewMemberComponent } from "./members/new-member/new-member.component";
import { TeamSettingsComponent } from "./teams/team-settings/team-settings.component";
import { ProjectAlertsComponent } from "./projects/project-detail/project-alerts/project-alerts.component";
import { ProjectEnvironmentsComponent } from "./projects/project-detail/project-environments/project-environments.component";
import { PlatformPickerComponent } from "./projects/platform-picker/platform-picker.component";
import { SlugifyDirective } from "./teams/new-team/slugify.directive";
import { AlertFormComponent } from "./projects/project-detail/project-alerts/alert-form/alert-form.component";
import { NewRecipientComponent } from "./projects/project-detail/project-alerts/new-recipient/new-recipient.component";
import { CopyInputComponent } from "../shared/copy-input/copy-input.component";
import { ProjectCardComponent } from "../shared/project-card/project-card.component";
import { EmptyProjectsComponent } from "../shared/project-card/empty-projects/empty-projects.component";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MobileNavToolbarModule,
        SettingsRoutingModule,
        MatChipsModule,
        MatDialogModule,
        MatTabsModule,
        MatRadioModule,
        MatExpansionModule,
        MatInputModule,
        MatCardModule,
        MatDividerModule,
        MatOptionModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        CopyInputComponent,
        ProjectCardComponent,
        EmptyProjectsComponent,
        LoadingButtonComponent,
        LessAnnoyingErrorStateMatcherModule,
        ProjectsComponent,
        NewProjectComponent,
        ProjectDetailComponent,
        OrganizationComponent,
        SettingsComponent,
        TeamsComponent,
        NewTeamComponent,
        TeamMembersComponent,
        MembersComponent,
        MemberDetailComponent,
        NewMemberComponent,
        TeamProjectsComponent,
        TeamDetailsComponent,
        TeamSettingsComponent,
        ProjectAlertsComponent,
        PlatformPickerComponent,
        SlugifyDirective,
        ProjectEnvironmentsComponent,
        AlertFormComponent,
        NewRecipientComponent,
    ],
    exports: [PlatformPickerComponent],
})
export class SettingsModule {}
