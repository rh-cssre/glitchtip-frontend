import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { moduleMetadata } from "@storybook/angular";
import { MarkdownModule } from "ngx-markdown";
import { of } from "rxjs";

import { IssuesPageComponent } from "./issues-page.component";
import { IssuesService } from "../issues.service";
import { issueList } from "./issues-test-data";
import { ProjectFilterBarComponent } from "src/app/list-elements/project-filter-bar/project-filter-bar.component";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { IssueZeroStatesComponent } from "../issue-zero-states/issue-zero-states.component";
import { LazyMarkdownModule } from "src/app/lazy-markdown/lazy-markdown.module";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";
import { DataFilterBarComponent } from "src/app/list-elements/data-filter-bar/data-filter-bar.component";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";

export default {
  title: "Issues/Issues Page",
  component: IssuesPageComponent,
  decorators: [
    moduleMetadata({
      imports: [
        GlitchtipTestingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MarkdownModule,
        LazyMarkdownModule,
      ],
      providers: [IssuesService, MatDatepickerModule, OrganizationsService],
      declarations: [
        ListTitleComponent,
        DataFilterBarComponent,
        ProjectFilterBarComponent,
        IssueZeroStatesComponent,
      ],
    }),
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

const sensibleDefaults = {
  initialLoadComplete: true,
  loading: false,
  issueLength: issueList.length,
  orgHasAProject: true,
  appliedProjectCount: 0,
  urlHasParam: false,
  projectsWhereAdminIsNotOnTheTeam: [],
  thereAreSelectedIssues: false,
  areAllSelected: false,
  userNotInSomeTeams: false,
};

const pageStateConfig: any = {
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

function selectProps(stateSelection: string) {
  const state = pageStateConfig[stateSelection];
  return {
    props: {
      loading$: of(state.loading),
      appliedProjectCount$: of(state.appliedProjectCount),
      areAllSelected$: of(state.areAllSelected),
      thereAreSelectedIssues$: of(state.thereAreSelectedIssues),
      projectsFromParams$: of([2, 3, 4]),
      issues$: of(issueList.slice(0, state.issueLength)),
    },
  };
}

export const Normal = () => {
  return selectProps("normal");
};

export const NormalOneProjectApplied = () => {
  return selectProps("normalOneProjectApplied");
};

export const InitialLoad = () => {
  return selectProps("initialLoad");
};

export const Loading = () => {
  return selectProps("loading");
};

// Should only be happening when issue length is 0
export const LoadingWithoutParams = () => {
  return selectProps("loadingWithoutParams");
};

// Checkboxes for issues won't check in storybook
export const NormalIssuesSelected = () => {
  return selectProps("normalIssuesSelected");
};

export const normalIssuesAllSelected = () => {
  return selectProps("normalIssuesAllSelected");
};

export const OrgHasNoProjects = () => {
  return selectProps("orgHasNoProjects");
};

export const NoIssuesUrlParams = () => {
  return selectProps("noIssuesUrlParams");
};

export const NoIssues = () => {
  return selectProps("noIssues");
};

export const NoIssuesMultipleProjects = () => {
  return selectProps("noIssuesMultipleProjects");
};

export const NoIssuesNotOnTeamSingleProject = () => {
  return selectProps("noIssuesNotOnTeamSingleProject");
};

export const NoIssuesNotOnTeamMultipleProjects = () => {
  return selectProps("noIssuesNotOnTeamMultipleProjects");
};

export const SomeIssuesButNotOnTeamForAll = () => {
  return selectProps("someIssuesButNotOnTeamForAll");
};
