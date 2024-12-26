import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  type: string; // 'individual' or 'organisation'
  role: string; // 'user', 'admin', etc.

  // Organisation fields (only required for admins creating an organisation)

  organisationName?: string;

  organisationCAC?: string;

  // Organisation ID (only required for normal users being added to an existing organisation)

  organisationId?: number; // Optional if the user is of type 'individual'
}
