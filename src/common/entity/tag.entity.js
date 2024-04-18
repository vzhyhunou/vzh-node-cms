import { Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { DateColumn } from '../decorator/date-column.decorator';

export class Tag {
  @PrimaryGeneratedColumn()
  id;

  @Column('varchar')
  @Index()
  @IsNotEmpty()
  name;

  @DateColumn({ nullable: true })
  start;

  @DateColumn({ nullable: true })
  end;
}
