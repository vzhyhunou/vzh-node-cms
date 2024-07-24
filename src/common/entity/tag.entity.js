import { Column, Index } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { Element } from './element.entity';

export class Tag extends Element {
  @Column({ type: String })
  @Index()
  @IsNotEmpty()
  name;

  @Column({ type: Date, nullable: true })
  start;

  @Column({ type: Date, nullable: true })
  end;
}
