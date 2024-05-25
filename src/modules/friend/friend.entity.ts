import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  requester: User;
  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  receiver: User;
  @Column({ default: 'pending' })
  status: string;
}
