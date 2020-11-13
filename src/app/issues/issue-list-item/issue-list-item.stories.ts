import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { IssueListItemComponent } from "./issue-list-item.component";
import { issueListFrontend } from "../issues-list-frontend-test-data";
import { HeaderNavComponent } from "../header-nav/header-nav.component";
import { SharedModule } from "../../shared/shared.module";

export default {
  title: "Issues List",
  decorators: [
    moduleMetadata({
      imports: [SharedModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [HeaderNavComponent],
    }),
    withKnobs,
  ],
};

export const issueListItem = () => ({
  component: IssueListItemComponent,
  props: {
    title: issueListFrontend[0].title,
  },
});

issueListItem.story = {
  name: "Issue List Item",
};
