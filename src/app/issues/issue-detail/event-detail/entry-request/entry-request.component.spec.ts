import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EntryRequestComponent } from "./entry-request.component";

describe("EntryRequestComponent", () => {
  let component: EntryRequestComponent;
  let fixture: ComponentFixture<EntryRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
