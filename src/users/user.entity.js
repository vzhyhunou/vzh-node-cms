import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { MinLength, ValidateNested } from 'class-validator';
import { Item } from '../common/entity/item.entity';
import { UserTag } from './user-tag.entity';

@Entity()
export class User extends Item {
  @PrimaryColumn({ type: String })
  id;

  @Column({ type: String })
  @Exclude({ toPlainOnly: true })
  @MinLength(5)
  password;

  @OneToMany(() => UserTag, (tag) => tag.user, { eager: true, cascade: true })
  @Type(() => UserTag)
  @ValidateNested()
  tags;
}
