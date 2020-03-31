import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EntryCSPComponent } from "./entry-csp.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/shared/shared.module";

describe("EntryRequestComponent", () => {
  let component: EntryCSPComponent;
  let fixture: ComponentFixture<EntryCSPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryCSPComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule]
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
