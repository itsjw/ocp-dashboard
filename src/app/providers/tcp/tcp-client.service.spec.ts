import { TestBed, inject } from '@angular/core/testing';

import { TcpClientService } from './tcp-client.service';

describe('TcpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TcpClientService]
    });
  });

  it('should be created', inject([TcpClientService], (service: TcpClientService) => {
    expect(service).toBeTruthy();
  }));
});
