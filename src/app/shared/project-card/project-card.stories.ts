import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata, Story } from "@storybook/angular";

import { MaterialModule } from "../material.module";
import { ProjectCardComponent } from "../project-card/project-card.component";


export default {
  title: "Shared/Project card",
  component: ProjectCardComponent,
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
  ],
  argTypes: {
    sampleCard:{
      options: [true, false]
    },
    isMember:{
      options: [true, false]
    }
  }
};

export const ProjectCard: Story = (args) => {
const { sampleCard, isMember } = args

  return {
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
      isMember,
    },
  };
};

ProjectCard.story = {
  parameters: {},
};


