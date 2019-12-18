import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

import { IssueListItemComponent } from "./issue-list-item.component";

describe("IssueListItemComponent", () => {
  let component: IssueListItemComponent;
  let fixture: ComponentFixture<IssueListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueListItemComponent],
      imports: [
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
