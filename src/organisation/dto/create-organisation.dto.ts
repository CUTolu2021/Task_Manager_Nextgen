import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrganisationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number; 

    @IsString()
    @IsNotEmpty()
    CAC: string;

 
}
