# How to contribute

You are encouraged to submit issues and merge requests.

A good issue includes reproducible steps for bugs. Clear use cases for feature requests.

A good merge request includes a unit test demonstrating how a bug exists and is fixed with your change. Out of caution, contributors must not view or be familiar with proprietary Sentry code. Our codebase borrows code and ideas from Sentry when it was open source. We provide a fork of the last open source version of sentry [here](https://gitlab.com/glitchtip/sentry-open-source). You may and should read, understand, and copy open source Sentry code. While Sentry's current code is on Github, it would violate their proprietary license to use it.

## Adding larger features and npm dependencies

Please open an issue to discuss any larger feature or new npm dependency before starting work. We aim to be very dependency-light so as to keep the project maintainable with very little time. Larger feature development is encouraged, provided you are willing to assist with general project maintainance. Consider asking what maintaince task you can help with.

# Frontend Architecture Overview

GlitchTip features an isolated backend API and this Angular single page application frontend. This project aims to produce a static bundle that can be included in a full GlitchTip docker image that is ultimately served by Django (or maybe ultimately by a CDN). In theory, you could build your own frontend if you wanted to.

## Frontend Coding Style and philosophy

We use Angular CLI for rapid, performant development. Components should be lazy loaded as needed. An explicit goal is to always be smaller and load JS faster than Sentry.

- Always use component encapsulated CSS (limit use of global)
- Use Storybook for presentational components, especially new design system components
- Use `signal`, `resource`, and `computed` for state
- Store state in a service, not the component. Use `{providedIn: "root"}` if service state must be shared. Otherwise provide it directly to the component.
- Avoid RXJS unless it's truly needed
- Use openapi-fetch instead of HttpClient
- Use OnPush change detection
- We don't have full test coverage. Complex functions should have unit tests. Trivial ones are acceptable without them as TypeScript checks them sufficiently. Integration tests that prove correctness of a collection of smaller functions is encouraged.
- We use Angular Material for rapid development. A component that works today is better than a nicer custom component that might work some day. But don’t bend over backwards to use Material if it doesn’t fit the use case
- Follow the [Angular style guide](https://angular.dev/style-guide)

## Contribution tutorial

Let's add a new page to GlitchTip with a pretend foo API. We'll assume the foo page requires being logged in and is organization specific. We'll assume the reader already has GlitchTip running locally.

Create a new component and service. The component is what the user is shown in a browser while the service contains logic including API interactions. You can learn more about Angular dev [here](https://angular.dev/tutorials) but if you already know similar systems we'll aim to get you up to speed in this tutorial.

```bash
ng generate component foo
ng generate service foo/foo-state
```

`src/app/foo/` now contains foo.html, foo.scss, foo.ts, and foo-state.ts. We're going to omit unit testing for now. But if you had a unit test, it might be named foo.spec.ts.

Next add the component to our router. We could lazy load an imported sub-route file with `loadChildren: () => import("./foo/routes")`. This is preferred when adding multiple nested pages. For this tutorial, we'll add just a single component. Edit `src/app/app.routes.ts`. To make the new page URL be `/<org-slug>/foo` we'll add a nested router under :org-slug

```typescript
{
  path: ":org-slug",
  component: OrganizationFrameComponent,
  children: [
    {
      path: "foo",
      loadComponent: () => import("./foo/foo").then(c => c.FooComponent),
      title: "Foo",
    },
  ]
}
```

Run GlitchTip `npm start`. In your browser, go to `localhost:4200/<your-org>/foo` and you should see "foo works!"

We'll assume you already added a foo API to glitchtip-backend. When the API changes, we need to update our openapi typescript spec with `npm run openapi-typescript`. To simplify the tutorial, we'll reuse the projects API and pretend it's returning our list of foos.

Edit `src/app/foo/foo-state.ts`

```TypeScript
import { computed, Injectable, resource, signal } from "@angular/core";
import { client } from "../api/api";  // openapi-fetch client

// This service only runs while it's FooComponent is being used
// To share service state globally, set @Injectable({providedIn: "root"})
@Injectable()
export class FooService {
  // Signals and resources store state https://angular.dev/guide/signals
  orgSlug = signal("");  // We'll get this from the component
  // https://angular.dev/guide/signals/resource
  // # means private, not accessible from outside of this class.
  #foosResource = resource({
    // The resource will load any time our request changes, in this case when orgSlug changes
    params: () => ({ orgSlug: this.#orgSlug() }),
    loader: async ({ params }) => {
      if (!params.orgSlug) {
        return undefined;  // Return undefined to indicate the resource has not yet loaded
      }
      // https://openapi-ts.dev/openapi-fetch/
      const { data, error, response } = await client.GET(
        "/api/0/organizations/{organization_slug}/projects/",
        {
          params: {
            path: { organization_slug: params.orgSlug },
          },
        },
      );
      if (response.status === 500) {
        // Localize the error message string https://angular.dev/guide/i18n
        throw $localize`Critical server side error`;
      }
      if (error) {
        throw error;
      }
      return data;
    },
  });
  // Use computed for any calculated value
  foos = computed(() => this.#foosResource.value());
  // We don't show the error in this tutorial, but you may show it via Material Snackbar or inline the page
  foosError = computed(() => this.foosResource.error());
  // This could show a loading spinner
  foosLoading = computed(() => this.foosResource.isLoading());
}
```

Next we'll provide the service to our FooComponent in `src/app/foo/foo.ts`

```TypeScript
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { FooService } from "./foo.service";

@Component({
  templateUrl: "./foo.html",
  styleUrl: "./foo.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FooService],  // Omit if providing globally (sharing state)
})
export class FooComponent implements OnInit {
  // Angular router will set this, see app.routes.ts path: ":org-slug",
  orgSlug = input.required<string>({ alias: "org-slug" });
  service = inject(FooService);
  foos = this.service.foos;
  
  // Init lifecycle hook
  ngOnInit() {
    // We choose to handle router logic in the component as part of presentation layer
    // but it means we must pass it to the service
    this.service.orgSlug.set(this.orgSlug());
  }
  // Most logic belongs in the service. But we may add presentation layer code here,
  // such as a Form https://angular.dev/guide/forms/reactive-forms
}
```

`src/app/foo/foo.html`

```html
<p>foo works!</p>

@for (foo of foos(); track foo.id) {
  {{ foo.name }}
}
```

Assuming you created a project, you should see a list of them in your browser now. However there is a bug, it will not display more than 50 foos due to pagination. See `src/app/shared/api/api-resource-factory.ts`.

- `apiResource` Extends resource to handle openapi-fetch.
- `apiResource.paginated` Extends resource to include pagination.

```TypeScript
  // Omitting "paginated" would work, but wouldn't set a paginator computed
  #foosResource = apiResource.paginated(this.#orgSlug, (params) => {
    url: "/api/0/organizations/{organization_slug}/projects/",
    options: {
      params: {
        path: { organization_slug: params.orgSlug },
      },
    }
  });
  paginator = computed(() => this.#foosResource.paginator());
```

This refactor simplifies resource handling with openapi-fetch and pagination. `paginator` is a computed signal with count, nextPageParams, and previousPageParams.

Use `resource` when you need control and customization.
Use `apiResource` and related for simple use cases around fetch API data.

This concludes our tutorial. Ask further questions on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im).
