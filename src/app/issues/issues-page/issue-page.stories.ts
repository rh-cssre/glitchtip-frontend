import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";
import { of } from "rxjs";

import { IssuesPageComponent } from "./issues-page.component";
import { MaterialModule } from "../../shared/material.module";
import { IssuesService } from "../issues.service";
import { issueListFrontend } from "../issues-list-frontend-test-data";
import { HeaderNavComponent } from "../header-nav/header-nav.component";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { IssueZeroStatesComponent } from "../issue-zero-states/issue-zero-states.component";

export default {
  title: "Issues/Issues Page",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
      ],
      providers: [IssuesService, MatDatepickerModule, OrganizationsService],
      declarations: [HeaderNavComponent, IssueZeroStatesComponent],
    }),
    withKnobs,
  ],
};

const sampleProjects = [
  {
    name: "GlitchTip",
    slug: "glitchtip",
    id: 1,
    platform: "javascript",
    isMember: true,
  },
  {
    name: "SwitchGrip",
    slug: "switchgrip",
    id: 2,
    platform: "python-django",
    isMember: false,
  },
  {
    name: "PitchFlip",
    slug: "pitchflip",
    id: 3,
    platform: null,
    isMember: true,
  },
  {
    name: "StitchStrip",
    slug: "stitchstrip",
    id: 4,
    platform: "javascript",
    isMember: true,
  },
  {
    name: "NicheScrip",
    slug: "nichescrip",
    id: 5,
    platform: "python-django",
    isMember: true,
  },
  {
    name: "TwitchQuip",
    slug: "twitchquip",
    id: 6,
    platform: null,
    isMember: false,
  },
  {
    name: "Wassilievitch Proprietorship",
    slug: "wassilievitch-proprietorship",
    id: 7,
    platform: "javascript",
    isMember: true,
  },
];

export const issueListItem = () => {
  const statesDefaultValue = "normal";
  const statesOptions = {
    "Normal, all projects": statesDefaultValue,
    "Normal, one project applied": "normalOneProjectApplied",
    "Initial Load": "initialLoad",
    "Loading with URL params (page change is a common use case)": "loading",
    "Loading without URL Params (should only be happening when issue length is 0)":
      "loadingWithoutParams",
    "Normal, some issues selected (checkboxes for issues won't check in storybook)":
      "normalIssuesSelected",
    "Normal, all issues selected (checkboxes for issues won't check in storybook)":
      "normalIssuesAllSelected",
    "Organization Has No Projects": "orgHasNoProjects",
    "No Issues because there are URL params (for example, search query is applied)":
      "noIssuesUrlParams",
    "No Issues": "noIssues",
    "No Issues, multiple projects": "noIssuesMultipleProjects",
    "No Issues because you're not on the team, single project":
      "noIssuesNotOnTeamSingleProject",
    "No Issues because you're not on the team, multiple projects":
      "noIssuesNotOnTeamMultipleProjects",
    "Some issues show, but you're not on the team for some of the projects":
      "someIssuesButNotOnTeamForAll",
  };
  const states = select("States", statesOptions, statesDefaultValue);

  const sensibleDefaults = {
    initialLoadComplete: true,
    loading: false,
    issueLength: issueListFrontend.length,
    orgHasAProject: true,
    appliedProjectCount: 0,
    urlHasParam: false,
    projectsWhereAdminIsNotOnTheTeam: [],
    thereAreSelectedIssues: false,
    areAllSelected: false,
    userNotInSomeTeams: false,
  };

  const pageStateConfig = {
    normal: {
      ...sensibleDefaults,
    },
    normalOneProjectApplied: {
      ...sensibleDefaults,
      appliedProjectCount: 1,
    },
    normalIssuesSelected: {
      ...sensibleDefaults,
      thereAreSelectedIssues: true,
    },
    normalIssuesAllSelected: {
      ...sensibleDefaults,
      thereAreSelectedIssues: true,
      areAllSelected: true,
    },
    initialLoad: {
      ...sensibleDefaults,
      issueLength: 0,
      initialLoadComplete: false,
      loading: true,
    },
    loading: {
      ...sensibleDefaults,
      initialLoadComplete: false,
      loading: true,
      urlHasParam: true,
    },
    loadingWithoutParams: {
      ...sensibleDefaults,
      initialLoadComplete: false,
      loading: true,
      issueLength: 0,
    },
    orgHasNoProjects: {
      ...sensibleDefaults,
      issueLength: 0,
      orgHasAProject: false,
    },
    noIssues: {
      ...sensibleDefaults,
      issueLength: 0,
    },
    noIssuesMultipleProjects: {
      ...sensibleDefaults,
      issueLength: 0,
      appliedProjectCount: 4,
    },
    noIssuesUrlParams: {
      ...sensibleDefaults,
      issueLength: 0,
      urlHasParam: true,
    },
    noIssuesNotOnTeamSingleProject: {
      ...sensibleDefaults,
      issueLength: 0,
      projectsWhereAdminIsNotOnTheTeam: [sampleProjects[1]],
    },
    noIssuesNotOnTeamMultipleProjects: {
      ...sensibleDefaults,
      issueLength: 0,
      appliedProjectCount: 4,
      projectsWhereAdminIsNotOnTheTeam: [sampleProjects[1], sampleProjects[4]],
    },
    someIssuesButNotOnTeamForAll: {
      ...sensibleDefaults,
      issueLength: 4,
      userNotInSomeTeams: true,
    },
  };

  return {
    component: IssuesPageComponent,
    props: {
      // initialLoadComplete$: of(pageStateConfig[states].initialLoadComplete),
      loading$: of(pageStateConfig[states].loading),
      appliedProjectCount$: of(pageStateConfig[states].appliedProjectCount),
      areAllSelected$: of(pageStateConfig[states].areAllSelected),
      thereAreSelectedIssues$: of(
        pageStateConfig[states].thereAreSelectedIssues
      ),
      // orgHasAProject$: of(pageStateConfig[states].orgHasAProject),
      projectsFromParams$: of([2, 3, 4]),
      // projectsWhereAdminIsNotOnTheTeam$: of(
      //   pageStateConfig[states].projectsWhereAdminIsNotOnTheTeam
      // ),
      urlHasParam$: of(pageStateConfig[states].urlHasParam),
      issues$: of(
        issueListFrontend.slice(0, pageStateConfig[states].issueLength)
      ),
      // userNotInSomeTeams$: of(pageStateConfig[states].userNotInSomeTeams),
    },
  };
};

issueListItem.story = {
  name: "Issues Page",
};
