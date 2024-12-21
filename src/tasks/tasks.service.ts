import { ExecutionContext, HttpException, HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateHistoryDto } from 'src/history/dto/create-history.dto';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { deleted, Task, taskStatus } from './entities/task.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { History, HistoryAction } from 'src/history/entities/history.entity';
import { error } from 'console';
import { REQUEST } from '@nestjs/core';
import { request } from 'http';
import { GetUser } from 'src/decorator/getUserDecorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly usersService: UsersService,
  ) { }
  async create(createTaskDto: CreateTaskDto, @GetUser() user: any) {
    try {
      //const request = context.switchToHttp().getRequest();
      //const activeUser = user;
      //check if logged in user organisation is same as the organisation of the user he has assigned a task to
      //if(user.organisation === .assignedBy.id) {
      const loggedInUserId = user.id;
      const loggedInUser = await this.usersService.findOne(loggedInUserId);
      if (user.type?.toLowerCase() === 'individual') {
        createTaskDto.assignedBy = { id: user.id, name: loggedInUser.name }
        createTaskDto.assignedTo = { id: user.id, name: loggedInUser.name }
        createTaskDto.organisation = null
        console.log("This individaul user has been creater")
      }
      else if ((user.type?.toLowerCase() === 'organisation' && user.role?.toLowerCase() === 'admin')) {
        const loggedInUserOrganisationId = loggedInUser.organisation?.id
        console.log("i am logged in ", loggedInUser)
        const AssignedTo = await this.usersService.findOne(createTaskDto.assignedTo.id)
        const AssignedToOrgId = AssignedTo.organisation?.id

        if ((loggedInUserOrganisationId === AssignedToOrgId)) {
          createTaskDto.assignedBy = { id: user.id, name: loggedInUser.name }
          createTaskDto.organisation = { id: loggedInUserOrganisationId }
          //console.log(`This admin is from organisation ${loggedInUser.organisation.name} and the user he assigned a task to ${AssignedTo} `)
        }
        else {
          throw new HttpException('User not a member of your Organisation', HttpStatus.BAD_REQUEST);
        }
      }


      const task = this.tasksRepository.save(createTaskDto);
      const createHistoryDto = new CreateHistoryDto();
      createHistoryDto.action = HistoryAction.CREATED;
      createHistoryDto.task = { id: (await task).id };
      createHistoryDto.user = { id: user.id }; // this should change to the id of the person that is logged in
      createHistoryDto.createdAt = new Date();
      await this.historyRepository.save(createHistoryDto);
      return task;
    }
    catch (error) {
      if (error instanceof QueryFailedError) {
        // handle the foreign key violation error
        console.error('Error saving task:', error);
        // log the error, display an error message to the user, etc.
        throw new NotFoundException('Failed to assign task. Please check the assignedTo user ID. User was not found.');
      } else {
        // handle other types of errors
        throw error;
      }
    }
  }


  async findAll(@GetUser() user: any) {
    const loggedInUserId = user.id;
      const loggedInUser = await this.usersService.findOne(loggedInUserId);
      const loggedInUserOrganisationId = loggedInUser.organisation?.id
        
    // const tasks = this.tasksRepository.find({
    //   relations: ['assignedBy', 'assignedTo', 'comments', 'organisation'],
    // })
    // return tasks;
    const tasks = await this.tasksRepository.find({
      where: {
        organisation: {
          id: loggedInUserOrganisationId,
        },
      },
    });
    return tasks;
  

    // const tasks = this.tasksRepository.query(`SELECT * from tasks where organisationId = ${loggedInUserOrganisationId}`)
    // return tasks;
  }


  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedBy', 'assignedTo', 'comments', 'organisation'],
    });
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    //The people who can update are admin of the organisation, or the user who assigned the task. Think about the personal users too
    const task = await this.tasksRepository.update(id, updateTaskDto);
    const createHistoryDto = new CreateHistoryDto();
    if (updateTaskDto.status === taskStatus.COMPLETED) {
      createHistoryDto.action = HistoryAction.COMPLETED;
    }
    else {
      createHistoryDto.action = HistoryAction.UPDATED;
    }
    console.log(updateTaskDto);
    createHistoryDto.task = { id };
    createHistoryDto.user = { id: updateTaskDto.assignedBy.id }; // this should change to the id of the person that is logged in
    createHistoryDto.createdAt = new Date();
    await this.historyRepository.save(createHistoryDto);
    return task;
  }

  async remove(id: number) {
    const Task = await this.tasksRepository.findOneBy({ id });
    if (!Task) {
      throw new NotFoundException('Task not found');
    }
    Task.deleted = deleted.YES;
    await this.tasksRepository.save(Task);
    return Task;
  }
}
