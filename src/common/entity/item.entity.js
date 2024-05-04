import { UpdateDateColumn, VersionColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { IdResolve } from '../decorator/id-resolve.decorator';

export class Item {
  @UpdateDateColumn()
  date;

  @ManyToOne(() => User)
  @IdResolve(() => User, 'userId')
  user;

  @VersionColumn()
  version;
}
