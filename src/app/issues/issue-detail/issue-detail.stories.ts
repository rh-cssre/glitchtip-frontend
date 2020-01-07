import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { IssueDetailComponent } from "./issue-detail.component";
import { sampleIssueDetail } from "./issue-detail-test-data";
import { MaterialModule } from "src/app/shared/material.module";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

export default {
  title: "Issues Detail",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    }),
    withKnobs
  ]
};

export const issueDetail = () => ({
  component: IssueDetailComponent,
  props: {
    issue$: of(sampleIssueDetail)
  }
});

issueDetail.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};
