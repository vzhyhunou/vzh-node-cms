import { Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class Tag {
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true })
  id;

  @Column({ type: String })
  @Index()
  @IsNotEmpty()
  name;

  @Column({ type: Date, nullable: true })
  start;

  @Column({ type: Date, nullable: true })
  end;
}
