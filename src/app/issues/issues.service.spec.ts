import { TestBed } from '@angular/core/testing';

import { IssuesService } from './issues.service';

describe('IssuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssuesService = TestBed.get(IssuesService);
    expect(service).toBeTruthy();
  });
});
