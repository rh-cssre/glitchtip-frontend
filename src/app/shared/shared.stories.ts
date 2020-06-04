import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

import { MaterialModule } from "src/app/shared/material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProjectCardComponent } from "./card/project-card/project-card.component";
import { EntryDataComponent } from "./entry-data/entry-data.component";
import { LoadingButtonComponent } from "./loading-button/loading-button.component";
import { CardComponent } from "./card/card.component";

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
      declarations: [CardComponent],
    }),
    withKnobs,
  ],
};

export const card = () => {
  return {
    template: `
    <app-card
      title="Input title"
    >
      <div content>
        This is the content section of app-card.
        <ul>
          <li>Pass in a "title"</li>
          <li>The card is fully clickable and accepts a routerLink to "cardLink" and query params to "cardLinkQueryParams"</li>
          <li>Content can be added to the card by adding a "content" selector to the tag wrapping that section</li>
          <li>Add actions to the bottom of the card by adding an "actions" selector to the tag wrapping your actions.</li>
        </ul>
      </div>
      <ng-container actions>
        <button mat-stroked-button color="primary">Use the "actions" selector for actions</button>
        <button mat-flat-button color="primary">they are always flexed with space-between</button>
      </ng-container>
    </app-card>
    `,
  };
};

card.story = {
  parameters: {},
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
