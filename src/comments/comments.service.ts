import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { GetUser } from '../decorator/getUserDecorator';
 

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) { }
  async create(createCommentDto: CreateCommentDto, @GetUser() user: any) {
    try {
      const loggedInUserId = user.id;
      const loggedInUser = await this.usersService.findOne(loggedInUserId);
      const loggedInUserOrganisationId = loggedInUser.organisation?.id

      const taskCommented = await this.tasksService.findOne(createCommentDto.task.id)
      if (taskCommented.organisation.id === loggedInUserOrganisationId) {
        createCommentDto.user = { id: loggedInUserId };
        const comment = await this.commentsRepository.save(createCommentDto);
        return comment;  
      }
      else {
        throw new HttpException('Task does not exist', HttpStatus.BAD_REQUEST);
      }
    }

    catch (error) {
      if (error instanceof QueryFailedError) {
        console.error('Error saving comment:', error);
        throw new NotFoundException('Failed to save comment. Please check the task ID. task was not found.');
      }
      else {
        throw error;
      }
    }
  }

  async findAll(taskId: number,@GetUser() user: any) {
    const loggedInUserId = user.id;
    const loggedInUser = await this.usersService.findOne(loggedInUserId);
    const loggedInUserOrganisationId = loggedInUser.organisation?.id
    const tasks = await this.tasksService.findOne( +taskId );
    if (tasks.organisation.id !== loggedInUserOrganisationId) {
      throw new HttpException('Task does not exist', HttpStatus.BAD_REQUEST);
    }
    return tasks.comments
  }

  findOne(id: number) {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, @GetUser() user: any) {
    try{
    const loggedInUserId = user.id;
    const loggedInUser = await this.usersService.findOne(loggedInUserId);
    const loggedInUserOrganisationId = loggedInUser.organisation?.id

    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['task', 'user']
    })
    const taskCommented = await this.tasksService.findOne(comment.task.id)
    //when this taskcommented is null postman bring a internal server error wven with the try and catch there
    if (taskCommented.organisation.id === loggedInUserOrganisationId) {
      if(comment.user.id === loggedInUserId){
        const commment = this.commentsRepository.update(id, updateCommentDto);
        return commment;
      }
      else {
        throw new HttpException('You did not create this comment.', HttpStatus.BAD_REQUEST);
      }
    }
    else {
      throw new HttpException('Comment does not exist. Please check the comment ID', HttpStatus.BAD_REQUEST);
    }
    }
    catch (error) {
      if (error) {
        console.error('Error saving comment:', error);
        throw new NotFoundException('Failed to save comment.');
      }
      else {
        throw error;
      }
    }
  }

  async remove(id: number, @GetUser() user: any) {
    const loggedInUserId = user.id;
    const loggedInUser = await this.usersService.findOne(loggedInUserId);
    const loggedInUserOrganisationId = loggedInUser.organisation?.id

    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'task.assignedBy', 'task.assignedTo']
    })
    const taskCommented = await this.tasksService.findOne(comment.task.id)
    if (taskCommented.organisation.id === loggedInUserOrganisationId) {
      if (comment.task.assignedBy.id === loggedInUserId || comment.user.id === loggedInUserId) {
        const commment = this.commentsRepository.delete(id);
        return commment;
      }
      else {
        throw new HttpException('Comment does not exist. Please check the comment ID', HttpStatus.BAD_REQUEST);
      }
    }
    else {
      throw new HttpException('Comment does not exist. Please check the comment ID', HttpStatus.BAD_REQUEST);
    }
  }
}
