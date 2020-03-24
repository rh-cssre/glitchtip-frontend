import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EntryExceptionComponent } from "./entry-exception.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "src/app/shared/material.module";

describe("EntryExceptionComponent", () => {
  let component: EntryExceptionComponent;
  let fixture: ComponentFixture<EntryExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryExceptionComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
