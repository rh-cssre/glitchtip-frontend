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

  /** Set partial state object combined with prior state without mutations */
  setState(newState: Partial<TState>) {
    this.state.set({ ...this.state(), ...newState });
  }

  /**
   * Set state back to initial state
   */
  clearState() {
    this.state.set(this.initialState);
  }
}
