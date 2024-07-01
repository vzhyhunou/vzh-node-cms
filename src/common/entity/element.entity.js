import { PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export class Element {
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true })
  id;
}
