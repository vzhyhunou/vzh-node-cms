import { Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class Tag {
  @PrimaryGeneratedColumn()
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
