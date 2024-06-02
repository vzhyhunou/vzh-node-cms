import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersHandler {
  beforeCreate(item) {
    item.password = bcrypt.hashSync(item.password, 10);
  }

  beforeSave(oldItem, newItem) {
    newItem.password = newItem.password
      ? bcrypt.hashSync(newItem.password, 10)
      : oldItem.password;
  }
}
