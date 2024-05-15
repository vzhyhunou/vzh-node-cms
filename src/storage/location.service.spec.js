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

  beforeAll(async () => {
    manager = { getId: jest.fn() };
    mappingsService = { findByType: jest.fn() };
    subj = new LocationService(manager, mappingsService);
  });

  it('location()', () => {
    manager.getId.mockReturnValue('a.b');
    mappingsService.findByType.mockReturnValue({ resource: 'resource' });
    const item = new Item();
    const result = subj.location(item);
    expect(result).toBe(path.join('resource', '1', '2', '3', 'a', 'b'));
    expect(manager.getId).toHaveBeenCalledWith(item);
    expect(mappingsService.findByType).toHaveBeenCalledWith(Item);
  });
});
