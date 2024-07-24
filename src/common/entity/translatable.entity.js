import { Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { Element } from './element.entity';

export class Translatable extends Element {
  @Column({ type: String, length: 2 })
  @IsNotEmpty()
  lang;
}
