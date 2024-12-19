import { Injectable } from '@nestjs/common';
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
    const organisation = await this.organisationRepository.save(
      createOrganisationDto,
    );
    return organisation;
  }

  async findAll(): Promise<any[]> {
    //return await this.organisationRepository.query(`SELECT * FROM ${name}`); //`This action returns all organisation`;
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

  async remove(id: number) {
    const Organisation = await this.organisationRepository.findOneBy({ id });
    Organisation.status = 'inactive'; 
    await this.organisationRepository.save(Organisation);
    return Organisation;
  }
}