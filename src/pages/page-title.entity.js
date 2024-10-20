import { Column, Entity } from 'typeorm';

import { PageTranslatable } from './page-translatable.entity';

@Entity()
export class PageTitle extends PageTranslatable {
  @Column({ type: String, nullable: true })
  value;
}
