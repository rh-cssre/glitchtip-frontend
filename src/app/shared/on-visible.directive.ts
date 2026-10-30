import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  output,
} from "@angular/core";

/** Emits once, when the element comes near the viewport, so off-screen rows load nothing. */
@Directive({ selector: "[gtOnVisible]" })
export class OnVisibleDirective {
  readonly gtOnVisible = output<void>();

  constructor() {
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => this.gtOnVisible.emit());
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          this.gtOnVisible.emit();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(inject(ElementRef).nativeElement);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
