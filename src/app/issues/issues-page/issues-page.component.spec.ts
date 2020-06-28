import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from "@angular/material/table";
import { of } from "rxjs";

import { IssuesPageComponent } from "./issues-page.component";
import { IssueListItemComponent } from "../issue-list-item/issue-list-item.component";
import { MaterialModule } from "src/app/shared/material.module";
import { issueList } from "../issues-list-from-api";
import { MatomoModule } from "ngx-matomo";

describe("IssuesPageComponent", () => {
  let component: IssuesPageComponent;
  let fixture: ComponentFixture<IssuesPageComponent>;
  let ISSUES;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssuesPageComponent, IssueListItemComponent],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatTableModule,
        NoopAnimationsModule,
        MatomoModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    ISSUES = of(issueList);
    fixture = TestBed.createComponent(IssuesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.issues$ = ISSUES as any;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
