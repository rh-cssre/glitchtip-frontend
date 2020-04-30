import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RawStacktraceComponent } from "./raw-stacktrace.component";

describe("RawStacktraceComponent", () => {
  let component: RawStacktraceComponent;
  let fixture: ComponentFixture<RawStacktraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawStacktraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawStacktraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
