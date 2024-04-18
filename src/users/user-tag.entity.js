import { Entity, ManyToOne } from 'typeorm';
import { Tag } from '../common/entity/tag.entity';
import { User } from './user.entity';

@Entity()
export class UserTag extends Tag {
  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user;
}
