import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata } from "@storybook/angular";

import { MaterialModule } from "../material.module";
import { EntryDataComponent } from "../entry-data/entry-data.component";

export default {
  title: "Shared/Entry Data",
  component: EntryDataComponent,
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
};

export const EntryData = () => ({
  props: {
    key: "Accept-Encoding",
    value: "gzip, deflate, br",
  },
});

EntryData.story = {
  parameters: { name: "Entry Data" },
};
