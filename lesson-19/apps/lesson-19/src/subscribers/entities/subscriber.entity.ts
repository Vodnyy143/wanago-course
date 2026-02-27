import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class SubscriberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;
}
