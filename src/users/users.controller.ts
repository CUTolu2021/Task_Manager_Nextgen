import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../decorator/getUserDecorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Post route is needed for admins to create users since signup is implemented
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin, Role.SubAdmin)
  findAll(@GetUser() user: any) {
    return this.usersService.findUsersByLoggedInAdmin(user);
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.SubAdmin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.SubAdmin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/organisation/:id')
  findUsersByOrganisation(@Param('id') id: string) {
    return this.usersService.findByOrganisation(+id);
  }
}
