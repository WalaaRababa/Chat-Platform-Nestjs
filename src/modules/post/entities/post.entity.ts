import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;
  @Column()
  content: string;
  @Column({ nullable: true })
  img: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
  @ManyToOne(() => User, (user) => user.posts)
  // @JoinColumn({ name: 'userId' })
  user: User;
}
