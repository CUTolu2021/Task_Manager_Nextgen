import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() userData: CreateUserDto) {
    return this.authService.signup(userData);
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    return this.authService.login(loginData);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile() {
    return 'This worked';
  }
}
