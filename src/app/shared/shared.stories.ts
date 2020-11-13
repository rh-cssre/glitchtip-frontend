import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

import { MaterialModule } from "./material.module";
import { ProjectCardComponent } from "./project-card/project-card.component";
import { EntryDataComponent } from "./entry-data/entry-data.component";
import { LoadingButtonComponent } from "./loading-button/loading-button.component";

export default {
  title: "Shared",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    }),
    withKnobs,
  ],
};

export const projectCard = () => {
  const sampleCard = boolean("Sample Card", false);

  return {
    component: ProjectCardComponent,
    props: {
      sampleCard,
      title: "alpaca",
      descriptionList: [
        { key: "organization", value: "knit" },
        { key: "date created", value: "Mar 30, 2020" },
      ],
      primaryButton: {
        text: "Issues",
        icon: "warning",
        link: "link",
      },
      secondaryButton: {
        text: "Settings",
        icon: "settings",
        link: "link",
      },
      isMember: boolean("isMember", true),
    },
  };
};

projectCard.story = {
  parameters: {},
};

export const entryData = () => ({
  component: EntryDataComponent,
  props: {
    key: "Accept-Encoding",
    value: "gzip, deflate, br",
  },
});

entryData.story = {
  parameters: { name: "Entry Data" },
};

export const loadingButton = () => {
  return {
    component: LoadingButtonComponent,
    props: {
      buttonText: text("Button Text", "ClickMe"),
      loading: boolean("Loading", false),
    },
  };
};

loadingButton.story = {
  name: "Button with Loading State",
};
