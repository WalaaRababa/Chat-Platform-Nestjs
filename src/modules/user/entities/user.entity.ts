import { JoinColumn } from 'typeorm';
// eslint-disable-next-line prettier/prettier
import { Friend } from "src/modules/friend/friend.entity";
import { Post } from 'src/modules/post/entities/post.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column({ length: 256 })
  password: string;
  @Column()
  username: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @OneToOne(() => Profile, { cascade: true })
  profile?: Profile;
  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];
  @OneToMany(() => Friend, (friend) => friend.requester, { cascade: true })
  sentFriendRequests: Friend[];
  @OneToMany(() => Friend, (friend) => friend.receiver, { cascade: true })
  receivedFriendRequests: Friend[];
}
