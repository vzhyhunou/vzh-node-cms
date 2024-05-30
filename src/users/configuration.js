import bcrypt from 'bcrypt';
import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { User } from './user.entity';

export class ParseUserPipe extends ParseItemPipe {
  constructor(manager) {
    super(manager, User);
  }

  async transform(value, metadata) {
    const entity = await super.transform(value, metadata);
    const { id, password } = entity;
    entity.password = password
      ? bcrypt.hashSync(password, 10)
      : (await this.transformOptions.manager.findOneBy(User, { id })).password;
    return entity;
  }
}
