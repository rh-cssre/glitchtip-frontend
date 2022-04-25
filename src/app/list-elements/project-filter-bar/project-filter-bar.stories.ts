import { MatExpansionModule } from "@angular/material/expansion";
import { moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";

import { ProjectFilterBarComponent } from "./project-filter-bar.component";
import { OrganizationProject } from "../../api/organizations/organizations.interface";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";

export default {
  title: "List elements/Project Filter Bar",
  decorators: [
    moduleMetadata({
      imports: [GlitchtipTestingModule, MatExpansionModule],
    }),
  ],
};

const sampleProjects: OrganizationProject[] = [
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

export const projectFilterBar = () => ({
  component: ProjectFilterBarComponent,
  props: {
    projects$: of(sampleProjects),
    appliedProjectIds: [1, 2, 5],
  },
});

projectFilterBar.story = {
  parameters: {},
};
