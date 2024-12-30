import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationModule } from '../organisation/organisation.module';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { History } from '../history/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task,History]), OrganisationModule, UsersModule ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule  {
}
