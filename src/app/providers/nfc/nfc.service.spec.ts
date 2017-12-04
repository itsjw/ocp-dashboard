import { TestBed, inject } from '@angular/core/testing';

import { NfcService } from './nfc.service';

describe('NfcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NfcService]
    });
  });

  it('should be created', inject([NfcService], (service: NfcService) => {
    expect(service).toBeTruthy();
  }));
});
