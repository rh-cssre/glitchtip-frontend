import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Fido2Component } from "./fido2.component";

describe("Fido2Component", () => {
  let component: Fido2Component;
  let fixture: ComponentFixture<Fido2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Fido2Component],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fido2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
