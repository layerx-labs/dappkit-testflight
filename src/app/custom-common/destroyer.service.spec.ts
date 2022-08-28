import { TestBed } from '@angular/core/testing';

import { DestroyerService } from './destroyer.service';

describe('DestroyerService', () => {
  let service: DestroyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestroyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
