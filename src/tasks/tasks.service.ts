import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    try{
    let user = await this.usersService.findOne(createTaskDto.assignedTo.id);
    //the if statement doesnt work thats why i had to put a try and catch something that has to do with database
    if(!user) {
       throw new NotFoundException('Failed to save task. Please check the assigned user ID. User was not found.');
    }
    //check if logged in user organisation is same as the organisation of the user he has assigned a task to
    //if(user.organisation === .assignedBy.id) {
    const task = this.tasksRepository.save(createTaskDto);
    return task;
  }
  catch(error) {
      if (error instanceof QueryFailedError) {
        // handle the foreign key violation error
        console.error('Error saving task:', error);
        // log the error, display an error message to the user, etc.
        throw new NotFoundException('Failed to save task. Please check the assigned user ID. User was not found.');
      } else {
        // handle other types of errors
        throw error;
      }
    }
  }
    

  findAll() {
    const tasks = this.tasksRepository.find({
      relations: ['assignedBy', 'assignedTo'],
    })
    return tasks;
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedBy', 'assignedTo', 'comments','organisation'],
    });
    // console.log(task.assignedBy.name); // prints the name of the user who assigned the task
    // console.log(task.assignedTo.name); // prints the name of the user who was assigned the task
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    //The people who can update are admin of the organisation, or the user who assigned the task. Think about the personal users too
    const task = await this.tasksRepository.update(id, updateTaskDto);
    return task;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
