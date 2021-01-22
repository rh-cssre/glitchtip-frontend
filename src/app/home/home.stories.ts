import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeComponent } from "./home.component";
import {
  orgDetails,
  paginatorPageOne,
  projectsPageOne,
} from "./home-test-data";

export default {
  title: "Home/Home",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
    }),
    withKnobs,
  ],
};

export const homeComponent = () => {
  /** This story is currently only set up to test the loading state */
  const paginationFirstPage = {
    ...paginatorPageOne,
    loading: boolean("Loading", false),
  };
  return {
    component: HomeComponent,
    props: {
      paginator$: of(paginationFirstPage),
      projects$: of(projectsPageOne),
      activeOrganizationDetail$: of(orgDetails),
    },
  };
};

homeComponent.story = {
  name: "Home Component",
};
