import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { User } from './user.entity';

export class ParseUserPipe extends ParseItemPipe {
  constructor(manager) {
    super(manager, User);
  }
}
