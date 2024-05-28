import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @ManyToMany(() => User, (user) => user.conversations)
  users: User[];
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
