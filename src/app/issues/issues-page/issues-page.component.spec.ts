import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material";

import { IssuesPageComponent } from "./issues-page.component";
import { IssueListItemComponent } from "../issue-list-item/issue-list-item.component";
import { MaterialModule } from "src/app/shared/material.module";

describe("IssuesPageComponent", () => {
  let component: IssuesPageComponent;
  let fixture: ComponentFixture<IssuesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssuesPageComponent, IssueListItemComponent],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatTableModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
