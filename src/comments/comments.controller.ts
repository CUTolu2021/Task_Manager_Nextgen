import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CommentCreationGuard } from './comment.guard';
import { GetUser } from '../decorator/getUserDecorator';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(CommentCreationGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @GetUser() user: any) {
    return this.commentsService.create(createCommentDto, user);
  }

  //This function is not necessary since comment are attacthed to task
  @Get('task/:id')
  findAll(@Param('id') id: string, @GetUser() user: any) {
    return this.commentsService.findAll(+id, user);
  }
  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }*/

  @UseGuards(CommentCreationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @GetUser() user: any) {
    return this.commentsService.update(+id, updateCommentDto, user);
  }

  @UseGuards(CommentCreationGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.commentsService.remove(+id, user);
  }
}
