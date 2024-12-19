import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    try{
    const comment = await this.commentsRepository.save(createCommentDto);
    return comment;
    }
    catch (error) {
      if (error instanceof QueryFailedError) {
        // handle the foreign key violation error
        console.error('Error saving comment:', error);
        // log the error, display an error message to the user, etc.
        throw new NotFoundException('Failed to save comment. Please check the task ID. task was not found.');
      }
      else {
        // handle other types of errors
        throw error;
      }
    }
  }

  findAll() {
    return this.commentsRepository.find({
      relations: ['task', 'user'],});
  }

  findOne(id: number) {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['task', 'user'],});
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    const commment = this.commentsRepository.update(id, updateCommentDto);
    return commment;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
