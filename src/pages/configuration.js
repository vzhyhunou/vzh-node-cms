import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { PatchItemPipe } from '../common/pipe/patch-item.pipe';
import { Page } from './page.entity';

export class ParsePagePipe extends ParseItemPipe {
  constructor(manager) {
    super(manager, Page);
  }
}

export class PatchPagePipe extends PatchItemPipe {
  constructor(manager, request) {
    super(manager, request, Page);
  }
}
