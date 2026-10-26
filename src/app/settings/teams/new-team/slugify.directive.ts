import { Directive, HostListener, ElementRef, inject } from "@angular/core";
@Directive({
  selector: "[gtSlugify]",
  standalone: true,
})
export class SlugifyDirective {
  private el = inject(ElementRef);

  regexStr = "^[ ]*$";

  @HostListener("keypress", ["$event"]) onKeyPress(event: KeyboardEvent) {
    if (new RegExp(this.regexStr).test(event.key)) {
      this.validateFields();
    }
    return true;
  }

  @HostListener("paste", ["$event"]) blockPaste(event: ClipboardEvent) {
    this.validateFields();
  }

  validateFields() {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replaceAll(
        " ",
        "-",
      );
    });
  }
}
