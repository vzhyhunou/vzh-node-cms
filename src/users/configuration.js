import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { PatchItemPipe } from '../common/pipe/patch-item.pipe';
import { User } from './user.entity';

export class ParseUserPipe extends ParseItemPipe {
  constructor(manager) {
    super(manager, User);
  }
}

export class PatchUserPipe extends PatchItemPipe {
  constructor(manager, request) {
    super(manager, request, User);
  }
}
