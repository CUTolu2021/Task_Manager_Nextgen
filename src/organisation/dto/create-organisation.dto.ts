import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrganisationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    CAC: string;

    @IsNumber()
    userId?: number;

 
}
