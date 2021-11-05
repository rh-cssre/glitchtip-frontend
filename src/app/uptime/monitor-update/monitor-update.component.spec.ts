import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MonitorUpdateComponent } from "./monitor-update.component";

describe("MonitorUpdateComponent", () => {
  let component: MonitorUpdateComponent;
  let fixture: ComponentFixture<MonitorUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
