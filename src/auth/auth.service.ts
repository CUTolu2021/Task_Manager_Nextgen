import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OrganisationService } from 'src/organisation/organisation.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly organisationsService: OrganisationService,
  ) {}

  async signup(userData: CreateUserDto) {
    const { password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;
    const user = await this.usersService.createUser(userData);
    console.log(userData)
    if (!user) {
      throw new Error('User creation failed');
    }
    if (user) {
      //const { password, ...result } = user;

      delete user.password;
      const payload = {
        id: user.id,
        role: user.role,
        type: user.type,
        email: user.email,
      };
      const token = await this.jwtService.signAsync(payload);
      return {
        token,
        user,
      };
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(email);
    console.log(password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    /* const { password, ...result } = user;
    console.log('password is' + password); */
    delete user.password;

    const payload = {
      id: user.id,
      role: user.role,
      type: user.type,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user,
    };
  }
}