import { TestBed, inject } from '@angular/core/testing';

import { BleService } from './ble.service';

describe('BleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BleService]
    });
  });

  it('should be created', inject([BleService], (service: BleService) => {
    expect(service).toBeTruthy();
  }));
});
