import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Expose, Type } from 'class-transformer';
import { IsOptional, MinLength, ValidateNested } from 'class-validator';
import { Item } from '../common/entity/item.entity';
import { UserTag } from './user-tag.entity';
import { RESOURCE } from '../common/entity/constants';

@Entity()
export class User extends Item {
  @PrimaryColumn({ type: String })
  id;

  @Column({ type: String })
  @Expose({ groups: [RESOURCE] })
  @IsOptional()
  @MinLength(5)
  password;

  @OneToMany(() => UserTag, (tag) => tag.user, { eager: true, cascade: true })
  @Type(() => UserTag)
  @ValidateNested()
  tags;
}
