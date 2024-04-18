import { User } from './user.entity';
import { ParseEntityPipe } from '../common/pipe/parse-item.pipe';

export class ParseUserPipe extends ParseEntityPipe {
  constructor(dataSource) {
    super(dataSource, User);
  }
}
