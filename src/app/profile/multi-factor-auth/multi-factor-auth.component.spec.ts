import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiFactorAuthComponent } from "./multi-factor-auth.component";

describe("MultiFactorAuthComponent", () => {
  let component: MultiFactorAuthComponent;
  let fixture: ComponentFixture<MultiFactorAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiFactorAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
