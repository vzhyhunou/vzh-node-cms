import { Column, Entity } from 'typeorm';

import { PageTranslatable } from './page-translatable.entity';

@Entity()
export class PageContent extends PageTranslatable {
  @Column({ type: 'text', nullable: true })
  value;
}
