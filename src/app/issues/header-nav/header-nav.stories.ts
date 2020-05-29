import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { MaterialModule } from "src/app/shared/material.module";
import { HeaderNavComponent } from "./header-nav.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { OrganizationProject } from "src/app/api/organizations/organizations.interface";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

export default {
  title: "Issue Header Nav",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    }),
    withKnobs
  ]
};

const sampleProjects: OrganizationProject[] = [
  {
    name: "GlitchTip",
    slug: "glitchtip",
    id: 1,
    platform: "javascript"
  },
  {
    name: "SwitchGrip",
    slug: "switchgrip",
    id: 2,
    platform: "python-django"
  },
  {
    name: "PitchFlip",
    slug: "pitchflip",
    id: 3,
    platform: null
  },
  {
    name: "StitchStrip",
    slug: "stitchstrip",
    id: 4,
    platform: "javascript"
  },
  {
    name: "NicheScrip",
    slug: "nichescrip",
    id: 5,
    platform: "python-django"
  },
  {
    name: "TwitchQuip",
    slug: "twitchquip",
    id: 6,
    platform: null
  },
  {
    name: "Wassilievitch Proprietorship",
    slug: "wassilievitch-proprietorship",
    id: 7,
    platform: "javascript"
  }
];

export const headerNav = () => ({
  component: HeaderNavComponent,
  props: {
    projects$: of(sampleProjects),
    appliedProjectIds: [1, 2, 5]
  }
});

headerNav.story = {
  parameters: {}
};
