import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueListItemComponent } from './issue-list-item.component';

describe('IssueListItemComponent', () => {
  let component: IssueListItemComponent;
  let fixture: ComponentFixture<IssueListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
