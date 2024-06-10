// tslint:disable:no-any
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { FrameExpandedComponent } from "./frame-expanded.component";

describe("FrameExpandedComponent", () => {
  let component: FrameExpandedComponent;
  let fixture: ComponentFixture<FrameExpandedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FrameExpandedComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should stringify all data that isn't already a string or null", () => {
    expect(typeof component.checkType(934)).toBe("string");
    expect(typeof component.checkType({ first: "one", second: "two" })).toBe(
      "string"
    );
    expect(typeof component.checkType(null)).toBe("string");
    expect(typeof component.checkType([1, 2, 3, 4])).toBe("string");
  });
});
