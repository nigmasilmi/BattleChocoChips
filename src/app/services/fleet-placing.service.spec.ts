import { TestBed } from '@angular/core/testing';

import { FleetPlacingService } from './fleet-placing.service';

describe('FleetPlacingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetPlacingService = TestBed.get(FleetPlacingService);
    expect(service).toBeTruthy();
  });
});
