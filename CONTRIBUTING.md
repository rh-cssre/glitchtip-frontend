# How to contribute

You are encouraged to submit issues and merge requests.

A good issue includes reproducible steps for bugs. Clear use cases for feature requests.

A good merge request includes a unit test demonstrating how a bug exists and is fixed with your change. Out of caution, contributors must not view or be familiar with proprietary Sentry code. Our codebase borrows code and ideas from Sentry when it was open source. We provide a fork of the last open source version of sentry [here](https://gitlab.com/glitchtip/sentry-open-source). You may and should read, understand, and copy open source Sentry code. While Sentry's current code is on Github, it would violate their proprietary license to use it.

# Frontend Architecture Overview

GlitchTip features an isolated backend API and this Angular single page application frontend. This project aims to produce a static bundle that can be included in a full GlitchTip docker image that is ultimately served by Django (or maybe ultimately by a CDN). In theory, you could build your own frontend if you wanted to.

## Frontend Coding Style and philosophy

We use Angular CLI for rapid, performant development. Modules should be lazy loaded as needed. An explicit goal is to always be smaller and load JS faster than Sentry.

- Always use component encapsulated CSS (limit use of global)
- Use Storybook
- Follow redux-like patterns using RXJS but do not actually use redux. Services should contain immutable state, pure functions, and rxjs pipelines to build selectors. Contributors should have a basic familiarity with state management systems like redux and with RXJS. See "Managing State" for details.
  - Do not store state in components except in trivial or rapid prototyping use cases.
- Use OnPush change detection. However very simple, isolated features maybe use Default.
- We don't have full test coverage. Complex functions should have unit tests. Trivial ones are acceptable without them as TypeScript checks them sufficiently. Integration tests that prove correctness of a collection of smaller functions is encouraged.
- We use Angular Material for rapid development. A component that works today is better than a nicer custom component that might work some day.
  - But don’t bend over backwards to use Material if it doesn’t fit the use case

## Managing State

GlitchTip uses rxjs's BehaviorSubject to provide state to components. Most components should extend the following base classes:

**StatefulBaseComponent** and **StatefulService**

StatefulBaseComponent provides a destroy$ observable on ngOnDestroy. Use it to unsubscribe with takeUntil(this.$destroy). It also calls service.clearState on destroy.

StatefulService provides a react-like `setState` and `clearState` functions.

**PaginatedBaseComponent** extends StatefulBaseComponent and **PaginationStatefulService** extends StatefulService

These components/services provide helpers for managing a single paginated list in state.
