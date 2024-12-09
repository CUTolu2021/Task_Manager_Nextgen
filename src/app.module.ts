import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganisationModule } from './organisation/organisation.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [OrganisationModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
