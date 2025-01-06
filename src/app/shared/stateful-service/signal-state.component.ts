import { Directive, OnDestroy } from "@angular/core";
import { StatefulService } from "./signal-state.service";

/**
 * Base component for working with BehaviorSubject state in an Angular Component
 * Implements OnDestroy logic to clear state and emit destroy$ for usage with takeUntil
 * For example, takeUntil(this.destroy$) will automatically unsubscribe.
 * https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
 */
@Directive()
export abstract class StatefulComponent<
  TState,
  TService extends StatefulService<TState>,
> implements OnDestroy
{
  constructor(protected service: TService) {}

  ngOnDestroy() {
    this.service.clearState();
  }
}
