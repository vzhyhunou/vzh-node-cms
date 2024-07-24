import path from 'path';

import { LocationService } from './location.service';

class Item {
  getParents() {
    return [1, '2.3'];
  }
}

describe('LocationService', () => {
  let manager;
  let mappingsService;
  let subj;

  beforeAll(() => {
    manager = { getId: jest.fn() };
    mappingsService = { findByItem: jest.fn() };
    subj = new LocationService(mappingsService, manager);
  });

  it('location()', () => {
    manager.getId.mockReturnValue('a.b');
    mappingsService.findByItem.mockReturnValue({
      resource: 'resource'
    });
    const item = new Item();
    const result = subj.location(item);
    expect(result).toBe(path.join('resource', '1', '2', '3', 'a', 'b'));
    expect(manager.getId).toHaveBeenCalledWith(item);
    expect(mappingsService.findByItem).toHaveBeenCalledWith(item);
  });
});
