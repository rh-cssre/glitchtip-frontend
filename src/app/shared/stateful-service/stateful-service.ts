import { BehaviorSubject, Observable } from "rxjs";

/**
 * Add RXJS BehaviorSubject drive redux-like state to any Angular service
 * All GlitchTip services with state should extend this class
 */
export abstract class StatefulService<TState> {
  protected state: BehaviorSubject<TState>;
  getState$: Observable<TState>;
  initialState: TState;

  constructor(initialState: TState) {
    this.initialState = initialState;
    this.state = new BehaviorSubject<TState>(initialState);
    this.getState$ = this.state.asObservable();
  }

  setState(newState: Partial<TState>) {
    this.state.next({ ...this.state.getValue(), ...newState });
  }

  /**
   * Set state back to initial state
   */
  clearState() {
    this.state.next(this.initialState);
  }
}
