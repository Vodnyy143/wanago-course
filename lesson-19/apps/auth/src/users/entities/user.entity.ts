import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class UserEntity {
  @Expose({ name: 'sub' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Exclude()
  @Column()
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Exclude()
  @Column({ nullable: true })
  avatarUrl: string | null;

  @Exclude()
  @Column({ nullable: true, unique: true })
  currentRefreshToken: string | null;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;
}
