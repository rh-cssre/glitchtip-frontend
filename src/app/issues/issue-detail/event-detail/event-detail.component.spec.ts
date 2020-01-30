import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { EventDetailComponent } from "./event-detail.component";
import { MaterialModule } from "src/app/shared/material.module";
import { EntryRequestComponent } from "./entry-request/entry-request.component";
import { EntryDataComponent } from "./entry-data/entry-data.component";

describe("EventDetailComponent", () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventDetailComponent,
        EntryRequestComponent,
        EntryDataComponent
      ],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
