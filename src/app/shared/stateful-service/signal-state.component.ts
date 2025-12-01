import { Directive, OnDestroy } from "@angular/core";
import { StatefulService } from "./signal-state.service";

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
