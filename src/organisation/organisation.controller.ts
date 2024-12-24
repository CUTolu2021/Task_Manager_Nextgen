import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard, RolesGuard, SuperAdminandAdminGuard, SuperAdminGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}
  //This route should not be accessible to any one since admin create organisations during their signup process
  // @Post()
  // create(@Body() createOrganisationDto: CreateOrganisationDto) {
  //   return this.organisationService.create(createOrganisationDto);
  // }

  @UseGuards(AdminGuard)
  @Post(':id/uploads')
  @UseInterceptors(FileInterceptor('file')) // Intercept and handle file uploads
  async uploadFile(@Param('id') id: string,@UploadedFile() file: Express.Multer.File) {
    // Call the OrganisationService to handle the file upload
    return await this.organisationService.uploadFile(+id,file);
  }

  @UseGuards(SuperAdminGuard)
  @Get()
  findAll() {
    return this.organisationService.findAll();
  }

  @UseGuards(SuperAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organisationService.findOneById(+id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
    return this.organisationService.update(+id, updateOrganisationDto);
  }

  //I assume i can have another patch request in the future case i want to change the approve status to false.
  @UseGuards(SuperAdminGuard)
  @Patch(':id/approve')
  async approveOrganisation(@Param('id') id: string, @Body() approved: boolean) {
    return this.organisationService.approveOrganisation(+id, true);
  }

  @UseGuards(SuperAdminandAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organisationService.remove(+id);
  }
}

