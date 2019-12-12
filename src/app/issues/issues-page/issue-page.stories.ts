import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";

import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { IssuesPageComponent } from "./issues-page.component";

export default {
  title: "Issues Page",
  decorators: [
    moduleMetadata({
      imports: [
        MatSelectModule,
        MatTableModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    }),
    withKnobs
  ]
};

export const issueListItem = () => ({
  component: IssuesPageComponent,
  props: {}
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};
