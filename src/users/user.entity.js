import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { MinLength } from 'class-validator';
import { Item } from '../common/entity/item.entity';
import { UserTag } from './user-tag.entity';
import { Valid } from '../common/decorator/valid.decorator';

@Entity()
export class User extends Item {
  @PrimaryColumn({ type: String })
  id;

  @Column({ type: String })
  @Exclude({ toPlainOnly: true })
  @MinLength(5)
  password;

  @OneToMany(() => UserTag, (tag) => tag.user, { eager: true, cascade: true })
  @Valid(() => UserTag)
  tags;
}
