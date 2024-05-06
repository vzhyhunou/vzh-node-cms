import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { MinLength } from 'class-validator';
import { Item } from '../common/entity/item.entity';
import { UserTag } from './user-tag.entity';
import { Valid } from '../common/decorator/valid.decorator';
import { RESOURCE } from '../common/entity/constants';

@Entity()
export class User extends Item {
  @PrimaryColumn({ type: String })
  id;

  @Column({ type: String })
  @Expose({ groups: [RESOURCE] })
  @MinLength(5)
  password;

  @OneToMany(() => UserTag, (tag) => tag.user, { eager: true, cascade: true })
  @Valid(() => UserTag)
  tags;
}
