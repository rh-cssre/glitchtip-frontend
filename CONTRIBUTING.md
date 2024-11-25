# How to contribute

You are encouraged to submit issues and merge requests.

A good issue includes reproducible steps for bugs. Clear use cases for feature requests.

A good merge request includes a unit test demonstrating how a bug exists and is fixed with your change. Out of caution, contributors must not view or be familiar with proprietary Sentry code. Our codebase borrows code and ideas from Sentry when it was open source. We provide a fork of the last open source version of sentry [here](https://gitlab.com/glitchtip/sentry-open-source). You may and should read, understand, and copy open source Sentry code. While Sentry's current code is on Github, it would violate their proprietary license to use it.

## Adding larger features and npm dependencies

Please open an issue to discuss any larger feature or new npm dependency before starting work. We aim to be very dependency-light so as to keep the project maintainable with very little time. Larger feature development is encouraged, provided you are willing to assist with general project maintainance. Consider asking what maintaince task you can help with.

# Frontend Architecture Overview

GlitchTip features an isolated backend API and this Angular single page application frontend. This project aims to produce a static bundle that can be included in a full GlitchTip docker image that is ultimately served by Django (or maybe ultimately by a CDN). In theory, you could build your own frontend if you wanted to.

## Frontend Coding Style and philosophy

We use Angular CLI for rapid, performant development. Modules should be lazy loaded as needed. An explicit goal is to always be smaller and load JS faster than Sentry.

- Always use component encapsulated CSS (limit use of global)
- Use Storybook
- Follow redux-like patterns using signals. Services should contain immutable state, pure functions, and computed function selectors. Contributors should have a basic familiarity with state management systems like redux, RXJS, and signals. See "Managing State" for details.
  - Do not store state in components except in trivial or rapid prototyping use cases.
- Use OnPush change detection. However very simple, isolated features maybe use Default.
- We don't have full test coverage. Complex functions should have unit tests. Trivial ones are acceptable without them as TypeScript checks them sufficiently. Integration tests that prove correctness of a collection of smaller functions is encouraged.
- We use Angular Material for rapid development. A component that works today is better than a nicer custom component that might work some day.
  - But don’t bend over backwards to use Material if it doesn’t fit the use case

## Managing State

GlitchTip uses signals (or rxjs's BehaviorSubject) to provide state to components. Use primarily signals and convert them to rxjs only when helpful. Most components should extend the following base classes:

**StatefulComponent** and **StatefulService**

StatefulComponent clears state on ngOnDestroy. Omit it if this isn't desired.

StatefulService provides react-like `setState` and `clearState` functions. `setState` should be used in reducer-style functions. Each such function should be responsible for setting all of the state in a service relevant to a given synchronous event.

A typical stateful service may look like:

```typescript
interface MyState {
  foo: string;
  loading: bool;
  // Real code should store error states too
}

const initialState: MyState = {
  foo: "init",
  loading: false,
};

@Injectable({
  providedIn: "root",
})
export class MyService extends StatefulService<MyState> {
  foo = computed(() => this.state().foo);
  constructor(myAPIService: MyAPIService) {
    super(initialState);
  }

  getFoo() {
    // More complex functions should be broken into a more explicit public "action" function and private "reducer" function. Simple ones can avoid such boilerplate.
    this.setState({ loading: true });
    console.log("direct state access", this.state());
    // or this.state.set(initialState);
    // Avoid calling HttpClient directly. Do not use fetch, as it won't get csrf tokens.
    return this.myAPIService.getFoo().pipe(tap((resp) => this.setState({ foo: resp.foo, loading: false })));
    // Add error handling in the pipe too for real code
  }
}
```

HttpClient API calls should be placed in a separate API service and imported into a StatefulService instance.

**PaginatedBaseComponent** extends StatefulBaseComponent and **PaginationStatefulService** extends StatefulService

These components/services provide helpers for managing a single paginated list in state.
