import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { OrganizationDetailComponent } from "./organization-detail.component";
import { MaterialModule } from "src/app/shared/material.module";

describe("OrganizationDetailComponent", () => {
  let component: OrganizationDetailComponent;
  let fixture: ComponentFixture<OrganizationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
