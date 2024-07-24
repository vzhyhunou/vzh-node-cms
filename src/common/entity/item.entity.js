import { Column, VersionColumn, ManyToOne } from 'typeorm';

import { User } from '../../users/user.entity';
import { IdResolve } from '../decorator/id-resolve.decorator';

export class Item {
  @Column({ type: Date, nullable: true })
  date;

  @ManyToOne(() => User)
  @IdResolve(() => User, 'userId')
  user;

  files = [];

  getParents() {
    return [];
  }

  @VersionColumn()
  version;
}
