import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationService } from './organisation.service';
import { Organisation } from './entities/organisation.entity';
import { DatabaseModule } from '../database/database.module';
import { OrganisationController } from './organisation.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organisation]),
    DatabaseModule,
    MulterModule.register(multerConfig),
  ],
  providers: [OrganisationService],
  controllers: [OrganisationController],
  exports: [OrganisationService],
})
export class OrganisationModule {}
