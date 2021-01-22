import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { SharedModule } from "src/app/shared/shared.module";
import { ProjectsComponent } from "./projects.component";
import {
  activeOrgSlug,
  paginatorPageOne,
  projectsPageOne,
} from "./projects-test-data";

export default {
  title: "Project Settings/Projects",
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

export const projectsComponent = () => {
  /** This story is currently only set up to test the loading state */
  const paginationFirstPage = {
    ...paginatorPageOne,
    loading: boolean("Loading", false),
  };
  return {
    component: ProjectsComponent,
    props: {
      paginator$: of(paginationFirstPage),
      projectsForActiveOrg$: of(projectsPageOne),
      activeOrganizationSlug$: of(activeOrgSlug),
    },
  };
};

projectsComponent.story = {
  name: "Projects Component",
};
