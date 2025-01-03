import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateHistoryDto } from '../history/dto/create-history.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { deleted, Task, taskStatus } from './entities/task.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { History, HistoryAction } from '../history/entities/history.entity';
import { GetUser } from '../decorator/getUserDecorator';
import { Role } from '../auth/role.enum';
import { PaginationDto } from 'src/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly usersService: UsersService,
  ) {}
  async create(createTaskDto: CreateTaskDto, @GetUser() user: any) {
    try {
      const loggedInUserId = user.id;
      const loggedInUser = await this.usersService.findOne(loggedInUserId);
      if (user.type?.toLowerCase() === 'individual') {
        createTaskDto.assignedBy = { id: user.id, name: loggedInUser.name };
        createTaskDto.assignedTo = { id: user.id, name: loggedInUser.name };
        createTaskDto.organisation = null;
      } else if (
        user.type?.toLowerCase() === 'organisation' &&
        user.role?.toLowerCase() === 'admin'
      ) {
        const loggedInUserOrganisationId = loggedInUser.organisation?.id;
        const AssignedTo = await this.usersService.findOne(
          createTaskDto.assignedTo.id,
        );
        const AssignedToOrgId = AssignedTo.organisation?.id;

        if (loggedInUserOrganisationId === AssignedToOrgId) {
          createTaskDto.assignedBy = { id: user.id, name: loggedInUser.name };
          createTaskDto.organisation = { id: loggedInUserOrganisationId };
        } else {
          throw new HttpException(
            'User not a member of your Organisation',
            HttpStatus.BAD_REQUEST,
          );
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
    } catch (error) {
      if (error instanceof QueryFailedError) {
        console.error('Error saving task:', error);
        throw new NotFoundException(
          'Failed to assign task. Please check the assignedTo user ID. User was not found.',
        );
      } else {
        throw error;
      }
    }
  }

  async findAll(
    paginationDto: PaginationDto,
    @GetUser() user: any,
    filterDto: Record<string, any>,
  ) {
    const loggedInUserId = user.id;
    console.log(user.type);
    const loggedInUser = await this.usersService.findOne(loggedInUserId);
    const loggedInUserOrganisationId = loggedInUser.organisation?.id;

    // Dynamic filter conditions
    const filterWhere: any = {};

    if (filterDto.taskName) {
      filterWhere.taskName = filterDto.taskName;
    }

    if (filterDto.status) {
      filterWhere.status = filterDto.status;
    }

    if (filterDto.assignedBy) {
      filterWhere.assignedBy = { id: filterDto.assignedBy };
    }

    if (filterDto.assignedTo) {
      filterWhere.assignedTo = { id: filterDto.assignedTo };
    }

    if (filterDto.dueDate) {
      filterWhere.dueDate = filterDto.dueDate;
    }

    if (user.type?.toLowerCase() === 'individual') {
      const tasks = await this.tasksRepository.find({
        skip: paginationDto.skip,
        take: paginationDto.limit || 5,
        where: {
          assignedTo: {
            id: loggedInUserId,
          },
          ...filterWhere,
        },
      });
      return tasks;
    }
    const tasks = await this.tasksRepository.find({
      take: paginationDto.limit || 5,
      skip: paginationDto.skip,
      where: {
        organisation: {
          id: loggedInUserOrganisationId,
        },
        ...filterWhere,
      },
      relations: ['assignedBy', 'assignedTo', 'comments'],
    });
    console.log(paginationDto.limit);
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
    const loggedInUserOrganisationId = loggedInUser.organisation?.id;
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
    let Mytask = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedBy', 'assignedTo'],
    });
    if (
      Mytask.assignedTo.id !== loggedInUserId ||
      Mytask.assignedBy.id !== loggedInUserId
    ) {
      throw new NotFoundException('You are not authorized to update this task');
    }
    if (user.role === Role.User && user.type === 'organisation') {
      //if a user should update a task he is most likely wanting to mark it as completed
      Mytask.status = taskStatus.COMPLETED;
      await this.tasksRepository.save(Mytask);
    } else {
      await this.tasksRepository.update(id, updateTaskDto);
    }

    const createHistoryDto = new CreateHistoryDto();
    if (
      updateTaskDto.status === taskStatus.COMPLETED ||
      Mytask.status === taskStatus.COMPLETED
    ) {
      createHistoryDto.action = HistoryAction.COMPLETED;
    } else {
      createHistoryDto.action = HistoryAction.UPDATED;
    }
    createHistoryDto.task = { id };
    createHistoryDto.user = { id: user.id };
    createHistoryDto.createdAt = new Date();
    await this.historyRepository.save(createHistoryDto);
    return await this.tasksRepository.findOne({ where: { id } });
  }

  async remove(id: number, @GetUser() user: any) {
    const Task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedBy', 'assignedTo'],
    });
    if (!Task) {
      throw new NotFoundException('Task not found');
    }
    const loggedInUserId = user.id;
    if (
      Task.assignedTo.id !== loggedInUserId ||
      Task.assignedBy.id !== loggedInUserId
    ) {
      throw new NotFoundException('Task not found'); //Reason for errors like this is to show multitenancy
    }
    Task.deleted = deleted.YES;
    await this.tasksRepository.save(Task);
    return Task;
  }
}
