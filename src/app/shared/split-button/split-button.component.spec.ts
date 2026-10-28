import { describe, expect, it } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { SplitButtonComponent } from "./split-button.component";

@Component({
  imports: [SplitButtonComponent, MatMenuModule],
  template: `
    <gt-split-button
      icon="content_copy"
      label="Copy for AI"
      menuLabel="More copy options"
      [menu]="menu"
      (action)="actions = actions + 1"
    />
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Copy event ID</button>
    </mat-menu>
  `,
})
class HostComponent {
  actions = 0;
}

describe("SplitButtonComponent", () => {
  function render() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, host: el.querySelector("gt-split-button")! };
  }

  it("is a group named by its label", () => {
    const { host } = render();
    expect(host.getAttribute("role")).toBe("group");
    expect(host.getAttribute("aria-label")).toBe("Copy for AI");
  });

  it("emits action from the main part", () => {
    const { fixture, host } = render();
    (host.querySelector(".gt-split__main") as HTMLButtonElement).click();
    expect(fixture.componentInstance.actions).toBe(1);
  });

  it("names the caret and marks it as a menu trigger", () => {
    const { host } = render();
    const caret = host.querySelector(".gt-split__caret")!;
    expect(caret.getAttribute("aria-label")).toBe("More copy options");
    expect(caret.getAttribute("aria-haspopup")).toBe("menu");
  });
});
