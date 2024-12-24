import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { OrganisationService } from 'src/organisation/organisation.service';
import { GetUser } from 'src/decorator/getUserDecorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly organisationsService: OrganisationService,
  ) {}

  //For the sake of quality code i need to check if an admin is creating a user and put info such as organisation id and role automatically
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { type, ...userData } = createUserDto;

    let organisation: Organisation | null = null;
    //console.log("In side userservice file: ", userData);

    if (type === 'organisation' && userData.role === 'admin') {
      if (!userData.organisationName || !userData.organisationCAC) {
        throw new HttpException(
          'Organisation name and CAC are required for organisation admin',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if an organisation with the same name or CAC already exists
      organisation = await this.organisationsService.findByNameOrCAC(
        userData.organisationName,
        userData.organisationCAC,
      );

      if (!organisation) {
        // Create new organisation if it doesn't exist
        organisation = await this.organisationsService.create({
          name: userData.organisationName,
          CAC: userData.organisationCAC,
        });
      }
    } else if (type === 'organisation' && userData.role === 'user') {
      if (!userData.organisationId) {
        throw new HttpException(
          'Organisation ID is required for organisation user',
          HttpStatus.BAD_REQUEST,
        );
      }
      organisation = await this.organisationsService.findOneById(
        userData.organisationId,
      );
      if (!organisation) {
        throw new HttpException(
          'Organisation not found.',
          HttpStatus.NOT_FOUND,
        );
      }
    } else if (type === 'individual') {
      organisation = null;
    } else {
      throw new HttpException('Invalid user type', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create({
      ...userData,
      type,
      organisation: organisation,
    });
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  //Only super admin should be able to find all
  // async findAll() {
  //   return this.userRepository.find({
  //     relations: ['organisation'],
  //   });
  // }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['organisation'],
    });
  }

  async findByOrganisation(id: number) {
    return await this.userRepository.find({
      where: { organisation: { id } },
      relations: ['organisation'],
    });
  }

  // Add username to the user entitiy later
  /* async findOneByUsername(userName: string) {
    console.log(userName);
    if (!userName) {
      return null;
    }
    const user = await this.userRepository.findOneBy({
      userName,
    });
    console.log('user is' + user);
    return user;
  } */

  async findUsersByLoggedInAdmin(@GetUser() user: any) {
    const loggedInUserId = user.id;
    const loggedInUser = await this.userRepository.findOne({
      where: { id: loggedInUserId },
      relations: ['organisation'],
    });
    const users = await this.userRepository.find({
      where: { organisation: { id: loggedInUser.organisation?.id } },
    });
    if (!users) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async findOneByNameOrEmail(nameOrEmail: string, @GetUser() user: any) {
    const loggedInUserId = user.id;
    const loggedInUser = await this.userRepository.findOne(loggedInUserId);

    const users = this.userRepository
      .createQueryBuilder('user')
      .where('user.name = :nameOrEmail OR user.email = :nameOrEmail', {
        nameOrEmail,
      })
      .andWhere('user.organisation = :organisationId', {
        organisationId: loggedInUser.organisation?.id,
      })
      .getMany();
    if (!users) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    console.log(updatedUser);
    return updatedUser;
  }

  async remove(id: number) {
    const User = await this.userRepository.findOneBy({ id });
    if (!User) {
      throw new NotFoundException('User not found');
    }
    User.status = 'inactive';
    await this.userRepository.save(User);
    return User;
  }
}
