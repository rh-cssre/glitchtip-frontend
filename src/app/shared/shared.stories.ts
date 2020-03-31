import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";

import { MaterialModule } from "src/app/shared/material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProjectCardComponent } from "./project-card/project-card.component";
import { EntryDataComponent } from "./entry-data/entry-data.component";

export default {
  title: "Shared",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ]
    }),
    withKnobs
  ]
};

export const projectCard = () => ({
  component: ProjectCardComponent,
  props: {
    title: "alpaca",
    descriptionList: [
      { key: "organization", value: "knit" },
      { key: "date created", value: "Mar 30, 2020" }
    ],
    primaryActionButtonIcon: "warning",
    primaryActionButtonText: "Issues",
    secondaryActionButtonIcon: "settings",
    secondaryActionButtonText: "Settings"
  }
});

projectCard.story = {
  parameters: {}
};

export const entryData = () => ({
  component: EntryDataComponent,
  props: {
    key: "Accept-Encoding",
    value: "gzip, deflate, br"
  }
});

entryData.story = {
  parameters: { name: "Entry Data" }
};
