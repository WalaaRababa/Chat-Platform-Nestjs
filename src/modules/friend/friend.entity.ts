import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  // @JoinColumn({ name: 'userId' })
  requester: User;
  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  receiver: User;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: 'pending' })
  status: string;
}
