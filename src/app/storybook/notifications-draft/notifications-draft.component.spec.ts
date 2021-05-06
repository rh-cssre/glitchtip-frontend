import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationsDraftComponent } from "./notifications-draft.component";

describe("NotificationsDraftComponent", () => {
  let component: NotificationsDraftComponent;
  let fixture: ComponentFixture<NotificationsDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
