import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";

import { MaterialModule } from "src/app/shared/material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TeamsComponent } from "./teams.component";
import { NewTeamComponent } from "./new-team/new-team.component";
import { MatomoModule } from "ngx-matomo";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SharedModule } from "src/app/shared/shared.module";
import { of } from "rxjs";

export default {
  title: "Teams",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatomoModule,
        MatDialogModule,
        SharedModule,
      ],
      declarations: [NewTeamComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }),
    withKnobs,
  ],
};

export const teams = () => {
  const teamsPerOrg = [
    {
      dateCreated: "2020-06-04T20:01:42.769987Z",
      id: 16,
      isMember: true,
      memberCount: 1,
      slug: "tweet",
    },
    {
      dateCreated: "2020-06-04T19:58:39.708355Z",
      id: 14,
      isMember: true,
      memberCount: 1,
      slug: "crunch",
    },
    {
      dateCreated: "2020-06-01T18:55:43.123199Z",
      id: 3,
      isMember: false,
      memberCount: 1,
      slug: "merino",
    },
    {
      dateCreated: "2020-03-23T15:41:21.972024Z",
      id: 2,
      isMember: true,
      memberCount: 1,
      slug: "food",
    },
    {
      dateCreated: "2020-03-23T15:41:11.023082Z",
      id: 1,
      isMember: true,
      memberCount: 2,
      slug: "fiber",
    },
  ];

  const statesDefaultValue = "hasTeams";
  const statesOptions = {
    "Has Teams": statesDefaultValue,
    "No Teams": "noTeams",
  };
  const states = select("States", statesOptions, statesDefaultValue);
  const pageStateConfig = {
    hasTeams: {
      teamsList: teamsPerOrg,
    },
    noTeams: {
      teamsList: [],
    },
  };
  return {
    component: TeamsComponent,
    props: {
      teams$: of(pageStateConfig[states].teamsList),
    },
  };
};

teams.story = {
  name: "Team Settings",
};
