import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "[gtAutofocus]",
})
export class Autofocus implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit() {
    if (
      this.el.nativeElement instanceof HTMLInputElement ||
      this.el.nativeElement instanceof HTMLTextAreaElement ||
      this.el.nativeElement instanceof HTMLSelectElement
    ) {
      this.el.nativeElement.focus();
    }
  }
}
