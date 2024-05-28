import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
  @ManyToOne(() => User, (user) => user.messages)
  user: User;
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
