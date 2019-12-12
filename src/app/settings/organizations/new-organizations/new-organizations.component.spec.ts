import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewOrganizationsComponent } from "./new-organizations.component";

describe("NewOrganizationsComponent", () => {
  let component: NewOrganizationsComponent;
  let fixture: ComponentFixture<NewOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewOrganizationsComponent]
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
