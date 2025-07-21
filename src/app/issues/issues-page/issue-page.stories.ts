import { signal } from "@angular/core";
import { IssuesPageComponent } from "./issues-page.component";
import { issueList } from "./issues-test-data";

export default {
  title: "Issues/Issues Page",
  component: IssuesPageComponent,
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
      loading: signal(state.loading),
      appliedProjectCount: signal(state.appliedProjectCount),
      areAllSelected: signal(state.areAllSelected),
      thereAreSelectedIssues: signal(state.thereAreSelectedIssues),
      projectsFromParams: signal([2, 3, 4]),
      issues: signal(issueList.slice(0, state.issueLength)),
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

export const NormalIssuesAllSelected = () => {
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
