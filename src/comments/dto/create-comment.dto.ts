import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    comment: string;

    
    @IsNotEmpty()
    task: { id: number; }; 

    
    @IsNotEmpty()
    user: { id: number; };

}
