import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    //@IsNumber()
    //@IsPositive()
    //@IsOptional()
    limit: number;

    //@IsNumber()
    //@IsPositive()
    //@IsOptional()
    skip: number;
}