import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(AuthGuard)
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}
  //This route should not be accessible to any one since admin create organisations during their signup process
  // @Post()
  // create(@Body() createOrganisationDto: CreateOrganisationDto) {
  //   return this.organisationService.create(createOrganisationDto);
  // }

  @UseGuards(RolesGuard)
  @Post(':id/uploads')
  @UseInterceptors(FileInterceptor('file')) // Intercept and handle file uploads
  @Roles(Role.Admin)
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.organisationService.uploadFile(+id, file);
  }

  @UseGuards(RolesGuard)
  @Get()
  @Roles(Role.SuperAdmin)
  findAll() {
    return this.organisationService.findAll();
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  @Roles(Role.SuperAdmin)
  findOne(@Param('id') id: string) {
    return this.organisationService.findOneById(+id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
  ) {
    return this.organisationService.update(+id, updateOrganisationDto);
  }

  //I assume i can have another patch request in the future case i want to change the approve status to false.
  @UseGuards(RolesGuard)
  @Patch(':id/approve')
  @Roles(Role.SuperAdmin)
  async approveOrganisation(
    @Param('id') id: string,
  ) {
    return this.organisationService.approveOrganisation(+id, true);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.organisationService.remove(+id);
  }
}
