import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

import { IssuesPageComponent } from "./issues-page.component";
import { IssueListItemComponent } from "../issue-list-item/issue-list-item.component";

describe("IssuesPageComponent", () => {
  let component: IssuesPageComponent;
  let fixture: ComponentFixture<IssuesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssuesPageComponent, IssueListItemComponent],
      imports: [
        MatCardModule,
        HttpClientTestingModule,
        MatInputModule,
        MatCheckboxModule,
        MatTableModule,
        ReactiveFormsModule,
        MatSelectModule
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
