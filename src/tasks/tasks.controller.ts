import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ExecutionContext } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { TaskCreationGuard } from './tasks.guard';
import { GetUser } from 'src/decorator/getUserDecorator';
import { AdminandUserGuard, AdminGuard } from 'src/auth/roles.guard';


@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @UseGuards(TaskCreationGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: any) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.tasksService.findAll(user);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.findOneByOrganisation(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser() user: any) {
    return this.tasksService.update(+id, updateTaskDto, user);
  }

  @UseGuards(AdminandUserGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.remove(+id, user);
  }
}
