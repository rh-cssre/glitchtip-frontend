import { of } from "rxjs";

import { ProjectFilterBarComponent } from "./project-filter-bar.component";


export default {
  title: "List elements/Project Filter Bar",
  component: ProjectFilterBarComponent,
};

const sampleProjects: any = [
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
    isMember: true,
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
    isMember: true,
  },
  {
    name: "Wassilievitch Proprietorship",
    slug: "wassilievitch-proprietorship",
    id: 7,
    platform: "javascript",
    isMember: true,
  },
];

export const ProjectFilterBar = () => ({
  props: {
    projects$: of(sampleProjects),
    appliedProjectIds: [1, 2, 5],
  },
});

ProjectFilterBar.story = {
  parameters: {},
};
