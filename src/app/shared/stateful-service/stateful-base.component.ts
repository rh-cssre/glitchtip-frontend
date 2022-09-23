import { Directive, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { StatefulService } from "./stateful-service";

/**
 * Base component for working with BehaviorSubject state in an Angular Component
 * Implements OnDestroy logic to clear state and emit destroy$ for usage with takeUntil
 * For example, takeUntil(this.destroy$) will automatically unsubscribe.
 * https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
 */
@Directive()
export abstract class StatefulBaseComponent<
  TState,
  TService extends StatefulService<TState>
> implements OnDestroy
{
  protected readonly destroy$ = new Subject<boolean>();

  constructor(protected service: TService) {}

  ngOnDestroy() {
    this.service.clearState();
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
