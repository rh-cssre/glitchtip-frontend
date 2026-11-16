import { signal, WritableSignal } from "@angular/core";

/**
 * Add signal driven redux-like state to any Angular service
 * All GlitchTip services with state should extend this class
 */
export abstract class StatefulService<TState> {
  protected state: WritableSignal<TState>;
  initialState: TState;

  constructor(initialState: TState) {
    this.initialState = initialState;
    this.state = signal(initialState);
  }

  /**
   * Set partial state object combined with prior state without mutations.
   *
   * Uses `signal.update()` rather than `set({ ...this.state(), ... })` on
   * purpose: the getter form is a tracked reactive read, so calling
   * `setState` synchronously from an `effect()` would subscribe that effect
   * to `state` and then write to it — a self-retriggering loop. `update()`
   * reads the current value untracked, so `setState` is safe to call from
   * any reactive context.
   */
  setState(newState: Partial<TState>) {
    this.state.update((state) => ({ ...state, ...newState }));
  }

  /**
   * Set state back to initial state
   */
  clearState() {
    this.state.set(this.initialState);
  }
}
