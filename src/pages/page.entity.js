import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { Item } from '../common/entity/item.entity';
import { PageTag } from './page-tag.entity';
import { PageTitle } from './page-title.entity';
import { PageContent } from './page-content.entity';
import { TranslatableResolve } from '../common/decorator/translatable-resolve.decorator';

@Entity()
export class Page extends Item {
  @PrimaryColumn({ type: String })
  id;

  @OneToMany(() => PageTag, (tag) => tag.page, { eager: true, cascade: true })
  @Type(() => PageTag)
  @ValidateNested()
  tags;

  @OneToMany(() => PageTitle, (title) => title.page, {
    eager: true,
    cascade: true
  })
  @ValidateNested()
  @TranslatableResolve(() => PageTitle, 'title')
  title;

  @OneToMany(() => PageContent, (content) => content.page, {
    eager: true,
    cascade: true
  })
  @ValidateNested()
  @TranslatableResolve(() => PageContent, 'content')
  content;
}
