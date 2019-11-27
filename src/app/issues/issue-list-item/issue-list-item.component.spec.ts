import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";

import { IssueListItemComponent } from "./issue-list-item.component";

describe("IssueListItemComponent", () => {
  let component: IssueListItemComponent;
  let fixture: ComponentFixture<IssueListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueListItemComponent],
      imports: [MatCardModule]
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
