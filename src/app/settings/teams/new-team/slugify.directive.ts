import { Directive, HostListener, ElementRef } from "@angular/core";
@Directive({
  selector: "[gtSlugify]",
  standalone: true,
})
export class SlugifyDirective {
  regexStr = "^[ ]*$";

  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(event: KeyboardEvent) {
    if (new RegExp(this.regexStr).test(event.key)) {
      this.validateFields();
    }
    return true;
  }

  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    this.validateFields();
  }

  validateFields() {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replaceAll(
        " ",
        "-"
      );
    });
  }
}
