import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewAlertRecipientComponent } from "./new-alert-recipient.component";

describe("NewAlertRecipientComponent", () => {
  let component: NewAlertRecipientComponent;
  let fixture: ComponentFixture<NewAlertRecipientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAlertRecipientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAlertRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
