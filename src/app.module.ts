import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { ProfileModule } from './modules/profile/profile.module';
import { FriendModule } from './modules/friend/friend.module';
import { Profile } from './modules/profile/entities/profile.entity';
import { Post } from './modules/post/entities/post.entity';
import { Friend } from './modules/friend/friend.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.Host,
      port: parseInt(process.env.Port),
      username: process.env.DB_Username,
      password: process.env.DB_password,
      database: process.env.DB_database,
      entities: [User, Profile, Post, Friend],
      synchronize: true,
    }),
    ProfileModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
