import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { IssueListItemComponent } from "./issue-list-item.component";
import { issueList } from "../issues-list-test-data";
import { HeaderNavComponent } from "../header-nav/header-nav.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";

export default {
  title: "Issues List",
  decorators: [
    moduleMetadata({
      imports: [SharedModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [HeaderNavComponent]
    }),
    withKnobs
  ]
};

export const issueListItem = () => ({
  component: IssueListItemComponent,
  props: {
    title: issueList[0].title
  }
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};
