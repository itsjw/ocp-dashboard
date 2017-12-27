import { TestBed, inject } from '@angular/core/testing';

import { NfccardToolService } from './nfccard-tool.service';

describe('NfccardToolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NfccardToolService]
    });
  });

  it('should be created', inject([NfccardToolService], (service: NfccardToolService) => {
    expect(service).toBeTruthy();
  }));
});
