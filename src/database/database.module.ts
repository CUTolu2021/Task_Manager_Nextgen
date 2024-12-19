import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { History } from 'src/history/entities/history.entity';

@Module({
  imports: [ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL,
    //   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      logger: 'simple-console',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'taskmanger',
      entities: [User, History, Task, Comment, Organisation],
      synchronize: true,
    }),
  ],  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}