import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uploadCAC } from '../cloudinary';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
  ) {}
  async create(createOrganisationDto: CreateOrganisationDto) {
    const organisation = await this.organisationRepository.save(
      createOrganisationDto,
    );
    return organisation;
  }

  async uploadFile(id: number, file: Express.Multer.File) {
    const organisation = await this.organisationRepository.findOneBy({ id });
    if (!organisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }
    const url = await uploadCAC( file.buffer, organisation.name + "_CAC_" + Date.now() );
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

  update(id: number, updateOrganisationDto: UpdateOrganisationDto) {
    return this.organisationRepository.update(id, updateOrganisationDto);
  }

  async approveOrganisation(id: number, approved: boolean) {
    const organisation = await this.organisationRepository.findOneBy({ id });
    organisation.approved = approved;
    return this.organisationRepository.save(organisation);
  }

  async remove(id: number) {
    const Organisation = await this.organisationRepository.findOneBy({ id });
    Organisation.status = 'inactive';
    await this.organisationRepository.save(Organisation);
    return Organisation;
  }
}
