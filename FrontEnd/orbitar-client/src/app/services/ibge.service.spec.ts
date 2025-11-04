import { TestBed } from '@angular/core/testing';

import { Ibge } from './ibge.service';

describe('Ibge', () => {
  let service: Ibge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ibge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
