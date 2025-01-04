import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uploadCAC } from '../cloudinary';
import { GetUser } from 'src/decorator/getUserDecorator';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
  ) { }
  async create(createOrganisationDto: CreateOrganisationDto) {
    const organisation = await this.organisationRepository.save(
      createOrganisationDto,
    );
    return organisation;
  }

  async uploadFile(id: number, file: Express.Multer.File) {
    //A check is ment to be here to make sure the admin is part of the organisation
    const organisation = await this.organisationRepository.findOneBy({ id });
    if (!organisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }
    const url = await uploadCAC(file.buffer, organisation.name + "_CAC_" + Date.now());
    organisation.CAC = url;
    const newUpload = await this.organisationRepository.save(organisation);
    return { message: 'File uploaded successfully', path: newUpload.CAC };
  }

  async findAll(): Promise<any[]> {
    return await this.organisationRepository.find({
      relations: ['users'],
    });
  }

  findOneById(id: number) {
    return this.organisationRepository.findOneBy({
      id,
    });
  }

  async findByNameOrCAC(
    name: string,
    CAC: string,
  ): Promise<Organisation | null> {
    return this.organisationRepository.findOne({
      where: [{ name }, { CAC }],
    });
  }

  async update(id: number, updateOrganisationDto: UpdateOrganisationDto, @GetUser() user: any) {
    try {
      const loggedInUserId = user.id;
      const organisation = await this.organisationRepository.findOneBy({ id, users: { id: loggedInUserId } });
      console.log(organisation);

      if (organisation === null) {
        throw new HttpException(
          'You are not authorized to update this organisation',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.organisationRepository.update(id, updateOrganisationDto);
    }
    catch (error) {
      if (error) {
        console.error('Error finding organisation:', error);
        throw new NotFoundException('Failed to find organisation. Please check the organisation ID.');
      }
    }
  }

  async approveOrganisation(id: number, approved: boolean) {
    const organisation = await this.organisationRepository.findOneBy({ id });
    organisation.approved = approved;
    return this.organisationRepository.save(organisation);
  }

  async remove(id: number) {
    //A check is ment to be here to make sure the admin is part of the organisation
    const organisation = await this.organisationRepository.findOneBy({ id });
    organisation.status = 'inactive';
    await this.organisationRepository.save(organisation);
    return organisation;
  }
}
