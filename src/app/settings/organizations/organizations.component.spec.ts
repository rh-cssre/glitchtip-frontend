import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { MaterialModule } from "src/app/shared/material.module";
import { OrganizationsComponent } from "./organizations.component";
import { OrganizationDetailComponent } from "./organization-detail/organization-detail.component";
import { SettingsComponent } from "../settings/settings.component";

describe("OrganizationsComponent", () => {
  let component: OrganizationsComponent;
  let fixture: ComponentFixture<OrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrganizationsComponent,
        OrganizationDetailComponent,
        SettingsComponent
      ],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
