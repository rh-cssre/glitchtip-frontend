import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LazyMarkdownComponent } from "./lazy-markdown.component";

describe("LazyMarkdownComponent", () => {
  let component: LazyMarkdownComponent;
  let fixture: ComponentFixture<LazyMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazyMarkdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
