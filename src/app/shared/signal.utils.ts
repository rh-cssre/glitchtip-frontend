import { Signal, linkedSignal } from "@angular/core";

/**
 * Keeps the previously emitted value while `source` is momentarily undefined,
 * e.g. a resource reloading, so a list keeps its rows during a reload.
 */
export function keepPreviousValue<T>(
  source: () => T | undefined,
): Signal<T | undefined> {
  // Explicit generics avoid a circular inference on `previous.value`.
  return linkedSignal<T | undefined, T | undefined>({
    source,
    computation: (value, previous) => value ?? previous?.value,
  }).asReadonly();
}
