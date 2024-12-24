import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OrganisationModule } from 'src/organisation/organisation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OrganisationModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    // If I wanted to apply them globally
    /* {
      provide: APP_GUARD,
      useClass: AuthGuard, // AuthGuard runs first
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, */
  ],
  exports: [UsersService],
})
export class UsersModule {}
