import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { of } from "rxjs";

import { IssuesPageComponent } from "./issues-page.component";
import { MaterialModule } from "src/app/shared/material.module";
import { IssuesService } from "../issues.service";
import { issueList } from "../issues-list-test-data";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export default {
  title: "Issues Page",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [IssuesService]
    }),
    withKnobs
  ]
};

export const issueListItem = () => ({
  component: IssuesPageComponent,
  props: {
    issues$: of(issueList)
  }
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};
