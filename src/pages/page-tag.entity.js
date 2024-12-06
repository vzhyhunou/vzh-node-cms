import { Entity, ManyToOne } from 'typeorm';
import { Tag } from '../common/entity/tag.entity';
import { Page } from './page.entity';

@Entity()
export class PageTag extends Tag {
  @ManyToOne(() => Page, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: false
  })
  page;
}
