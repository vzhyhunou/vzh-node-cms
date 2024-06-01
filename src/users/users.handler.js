import bcrypt from 'bcrypt';
import { ItemsHandler } from '../storage/items.handler';

export class UsersHandler extends ItemsHandler {
  constructor(fileService, locationService) {
    super(fileService, locationService);
  }

  beforeCreate(item) {
    item.password = bcrypt.hashSync(item.password, 10);
  }

  beforeSave(oldItem, newItem) {
    newItem.password = newItem.password
      ? bcrypt.hashSync(newItem.password, 10)
      : oldItem.password;
  }
}
