import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
  ) {}
  async create(createOrganisationDto: CreateOrganisationDto) {
    const organisation = await this.organisationRepository.save(createOrganisationDto);
    return organisation;
  }

  async findAll(name: string): Promise<any[]> {
    return await this.organisationRepository.query(`SELECT * FROM ${name}`); //`This action returns all organisation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organisation`;
  }

  update(id: number, updateOrganisationDto: UpdateOrganisationDto) {
    return `This action updates a #${id} organisation`;
  }

  remove(id: number) {
    return `This action removes a #${id} organisation`;
  }
}
