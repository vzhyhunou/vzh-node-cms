import { ManyToOne } from 'typeorm';

import { Translatable } from '../common/entity/translatable.entity';
import { Page } from './page.entity';

export class PageTranslatable extends Translatable {
  @ManyToOne(() => Page, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  page;
}
