import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { of } from "rxjs";

import { IssuesPageComponent } from "./issues-page.component";
import { MaterialModule } from "src/app/shared/material.module";
import { IssuesService } from "../issues.service";
import { issueListFrontend } from "../issues-list-frontend-test-data";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderNavComponent } from "../header-nav/header-nav.component";

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
      providers: [IssuesService],
      declarations: [HeaderNavComponent]
    }),
    withKnobs
  ]
};

export const issueListItem = () => ({
  component: IssuesPageComponent,
  props: {
    oneProjectApplied$: of(false),
    issues$: of(issueListFrontend)
  }
});

issueListItem.story = {
  name: "Issues Page"
};
