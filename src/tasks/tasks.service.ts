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
import { Role } from 'src/auth/role.enum';

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
      }
      else if ((user.type?.toLowerCase() === 'organisation' && user.role?.toLowerCase() === 'admin')) {
        const loggedInUserOrganisationId = loggedInUser.organisation?.id
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

      //History is working for both individual and organisation users
      const task = this.tasksRepository.save(createTaskDto);
      const createHistoryDto = new CreateHistoryDto();
      createHistoryDto.action = HistoryAction.CREATED;
      createHistoryDto.task = { id: (await task).id };
      createHistoryDto.user = { id: user.id }; 
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
        
    if(user.type?.toLowerCase() === 'individual'){
      const tasks = await this.tasksRepository.find({
        where: {
          assignedTo: {
            id: loggedInUserId,
          }
        },
        relations: ['assignedBy', 'assignedTo', 'comments', ],
      });
      return tasks;
    }
    const tasks = await this.tasksRepository.find({
      where: {
        organisation: {
          id: loggedInUserOrganisationId,
        }
         },
         relations: ['assignedBy', 'assignedTo', 'comments', ],
    });
    return tasks;
  }


  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedBy', 'assignedTo', 'comments', 'organisation'],
    });
    return task;
  }

  async findOneByOrganisation(id: number, @GetUser() user: any) {
    const loggedInUserId = user.id;
      const loggedInUser = await this.usersService.findOne(loggedInUserId);
      const loggedInUserOrganisationId = loggedInUser.organisation?.id
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedBy', 'assignedTo', 'comments', 'organisation'],
    });
    if (task.organisation.id !== loggedInUserOrganisationId) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, @GetUser() user: any) {
    //The people who can update are admin of the organisation, or the user who assigned the task. Think about the personal users too
    const loggedInUserId = user.id;
    let Mytask = await this.tasksRepository.findOne({ where: { id },
      relations: ['assignedBy', 'assignedTo'], });
    if (Mytask.assignedTo.id !== loggedInUserId || Mytask.assignedBy.id !== loggedInUserId) {
      throw new NotFoundException('You are not authorized to update this task');
    }
    if(user.role === Role.User && user.type === 'organisation'){
      //if a user should update a task he is most likely wanting to mark it as completed
      Mytask.status = taskStatus.COMPLETED
      await this.tasksRepository.save(Mytask);
    }
    else
    {
      await this.tasksRepository.update(id, updateTaskDto);
    }
    
    const createHistoryDto = new CreateHistoryDto();
    if (updateTaskDto.status === taskStatus.COMPLETED || Mytask.status === taskStatus.COMPLETED) {
      createHistoryDto.action = HistoryAction.COMPLETED;
    }
    else {
      createHistoryDto.action = HistoryAction.UPDATED;
    }
    createHistoryDto.task = { id };
    createHistoryDto.user = { id: user.id }; 
    createHistoryDto.createdAt = new Date();
    await this.historyRepository.save(createHistoryDto);
    return await this.tasksRepository.findOne({ where: { id } });
  }

  async remove(id: number, @GetUser() user: any) {
    const Task = await this.tasksRepository.findOne({ where: { id },
      relations: ['assignedBy', 'assignedTo'], });
    if (!Task) {
      throw new NotFoundException('Task not found');
    }
    const loggedInUserId = user.id;
    if (Task.assignedTo.id !== loggedInUserId || Task.assignedBy.id !== loggedInUserId) {
      throw new NotFoundException('Task not found');//Reason for errors like this is to show multitenancy
    }
    Task.deleted = deleted.YES;
    await this.tasksRepository.save(Task);
    return Task;
  }
}