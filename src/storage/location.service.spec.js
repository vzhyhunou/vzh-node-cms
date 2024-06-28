import path from 'path';
import { LocationService } from './location.service';

class Item {
  getParents() {
    return [1, '2.3'];
  }
}

describe('LocationService', () => {
  let repository;
  let mappingsService;
  let subj;

  beforeAll(() => {
    repository = { getId: jest.fn() };
    mappingsService = { findByItem: jest.fn() };
    subj = new LocationService(mappingsService);
  });

  it('location()', () => {
    repository.getId.mockReturnValue('a.b');
    mappingsService.findByItem.mockReturnValue({
      resource: 'resource',
      repository
    });
    const item = new Item();
    const result = subj.location(item);
    expect(result).toBe(path.join('resource', '1', '2', '3', 'a', 'b'));
    expect(repository.getId).toHaveBeenCalledWith(item);
    expect(mappingsService.findByItem).toHaveBeenCalledWith(item);
  });
});
