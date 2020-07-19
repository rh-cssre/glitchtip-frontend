import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { NewOrganizationsComponent } from "./new-organization.component";
import { MaterialModule } from "../shared/material.module";

describe("NewOrganizationsComponent", () => {
  let component: NewOrganizationsComponent;
  let fixture: ComponentFixture<NewOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewOrganizationsComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
