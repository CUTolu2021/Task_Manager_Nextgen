import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { OrganisationService } from 'src/organisation/organisation.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly organisationsService: OrganisationService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { type, ...userData } = createUserDto;

    let organisation: Organisation | null = null;

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

  async findAll() {
    return this.userRepository.find({
      relations: ['organisation'],
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({
      id,
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

  async findUsersByOrganisationId(id: number) {
    return this.userRepository.find({
      where: { organisation: { id } },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    console.log(updatedUser);
    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = this.userRepository.delete(id);
    return deletedUser;
  }
}
