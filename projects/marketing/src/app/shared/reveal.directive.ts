import { Directive, ElementRef, afterNextRender, inject } from "@angular/core";

/**
 * Reveals an element with a subtle fade/rise the first time it scrolls into
 * view. Performance and robustness notes:
 * - Runs only in the browser (afterNextRender never fires during SSR/prerender),
 *   so the prerendered HTML keeps every section visible for no-JS and SEO.
 * - Animates transform + opacity only (GPU-composited, no layout/paint thrash).
 * - Uses a single IntersectionObserver and disconnects after the first reveal,
 *   so there is no ongoing scroll work.
 * - Honors prefers-reduced-motion, and never hides content that is already in
 *   (or near) the viewport on load, so above-the-fold sections never flash.
 */
@Directive({
  selector: "[mktReveal]",
})
export class RevealDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const node = this.host.nativeElement;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      // Anything already visible on load stays put (no hide, no animation).
      if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
        return;
      }

      node.classList.add("is-reveal");
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add("is-visible");
              observer.disconnect();
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      observer.observe(node);
    });
  }
}
