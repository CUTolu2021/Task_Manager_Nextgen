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
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/decorator/getUserDecorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
//Post route is needed for admins to create users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }


  @Get()
  //@Roles(Role.Admin)
  findAll(@GetUser() user: any) {
    return this.usersService.findUsersByLoggedInAdmin(user);
  }

  
  // @Get(':id')
  // //@Roles(Role.Admin)
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  //}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/organisation/:id')
  findUsersByOrganisation(@Param('id') id: string) {
    return this.usersService.findByOrganisation(+id);
  }
}