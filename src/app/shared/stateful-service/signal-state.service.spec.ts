import { Injectable, effect } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { StatefulService } from "./signal-state.service";

interface TestState {
  count: number;
  label: string;
}

@Injectable()
class TestStatefulService extends StatefulService<TestState> {
  constructor() {
    super({ count: 0, label: "" });
  }

  /** Expose protected state for assertions. */
  read() {
    return this.state();
  }
}

describe("StatefulService", () => {
  let service: TestStatefulService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TestStatefulService] });
    service = TestBed.inject(TestStatefulService);
  });

  it("merges partial state without mutating prior keys", () => {
    service.setState({ count: 1 });
    service.setState({ label: "hello" });

    expect(service.read()).toEqual({ count: 1, label: "hello" });
  });

  it("clearState restores the initial state", () => {
    service.setState({ count: 9, label: "dirty" });
    service.clearState();

    expect(service.read()).toEqual({ count: 0, label: "" });
  });

  // Regression for MR !682 / fix/stateful-setstate-effect-loop:
  // setState previously did `this.state.set({ ...this.state(), ... })`. The
  // `this.state()` getter is a tracked reactive read, so calling setState
  // synchronously from an effect subscribed that effect to `state` and then
  // wrote to it — an unbounded self-retriggering loop (observed crashing the
  // tab after the Stripe checkout redirect). `.update()` reads untracked, so
  // the effect must run exactly once here.
  it("setState called from an effect does not retrigger that effect", () => {
    let runs = 0;

    TestBed.runInInjectionContext(() => {
      effect(() => {
        runs++;
        // Safety cap: a regression makes this loop. The cap lets the test
        // fail on the assertion below instead of hanging the runner.
        if (runs > 50) return;
        service.setState({ count: runs });
      });
    });

    // Flush the effect queue. With the bug this re-enqueues itself until the
    // cap; with the fix it settles after a single run.
    TestBed.tick();
    TestBed.tick();

    expect(runs).toBe(1);
    expect(service.read().count).toBe(1);
  });
});
