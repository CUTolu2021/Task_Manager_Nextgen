import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TaskCreationGuard } from './tasks.guard';
import { GetUser } from '../decorator/getUserDecorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { PaginationDto } from '../pagination.dto';

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
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: Record<string, any>,
    @GetUser() user: any,
  ) {
    console.log(paginationDto.limit, 'and', paginationDto.skip);
    //console.log('user is' + user);
    return this.tasksService.findAll(paginationDto, user, filterDto);
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.SubAdmin)
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.findOneByOrganisation(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: any,
  ) {
    return this.tasksService.update(+id, updateTaskDto, user);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.remove(+id, user);
  }
}
