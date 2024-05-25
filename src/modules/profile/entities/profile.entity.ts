import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 256 })
  bio: string;
  @Column()
  avatar: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
