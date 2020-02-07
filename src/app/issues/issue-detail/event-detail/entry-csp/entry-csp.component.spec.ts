import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EntryCSPComponent } from "./entry-csp.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "src/app/shared/material.module";
import { EntryDataComponent } from "../entry-data/entry-data.component";

describe("EntryRequestComponent", () => {
  let component: EntryCSPComponent;
  let fixture: ComponentFixture<EntryCSPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryCSPComponent, EntryDataComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCSPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
