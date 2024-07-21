import { Column, Entity, ManyToOne } from 'typeorm';
import { Translatable } from '../common/entity/translatable.entity';
import { Page } from './page.entity';

@Entity()
export class PageTitle extends Translatable {
  @ManyToOne(() => Page, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  page;

  @Column({ type: String, nullable: true })
  title;
}
