import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";
import { IssueDetailComponent } from "./issue-detail.component";
import { sampleIssueDetail } from "./issue-detail-test-data";
import { MaterialModule } from "src/app/shared/material.module";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";
import { IssueDetailTitleComponent } from "./issue-detail-title/issue-detail-title.component";

export default {
  title: "Issues Detail",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [IssueDetailTitleComponent],
    }),
    withKnobs,
  ],
};

export const issueDetail = () => ({
  component: IssueDetailComponent,
  props: {
    issue$: of(sampleIssueDetail),
  },
});

issueDetail.story = {
  name: "Issue Detail",
};

export const IssueDetailTitle = () => {
  const issueTypeOptions = "default";
  return {
    component: IssueDetailComponent,
    props: {
      issueType: issueTypeOptions,
      culprit: select(
        "Culprit",
        { Culprit: "this is the culprit", Null: null },
        "this is the culprit"
      ),
    },
  };
};

IssueDetailTitle.story = {
  name: "Issue Detail Title",
};
