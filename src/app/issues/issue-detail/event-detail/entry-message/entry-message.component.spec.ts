import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EntryMessageComponent } from "./entry-message.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "src/app/shared/material.module";

describe("EntryRequestComponent", () => {
  let component: EntryMessageComponent;
  let fixture: ComponentFixture<EntryMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryMessageComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
