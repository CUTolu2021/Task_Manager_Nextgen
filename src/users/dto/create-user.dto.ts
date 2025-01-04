import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\\#])[A-Za-z\d@$!%*?&\\#]{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
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
