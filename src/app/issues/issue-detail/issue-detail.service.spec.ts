import { TestBed } from '@angular/core/testing';

import { IssueDetailService } from './issue-detail.service';

describe('IssueDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueDetailService = TestBed.get(IssueDetailService);
    expect(service).toBeTruthy();
  });
});
