import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateVinylDto {
    @IsString()
    name: string;

    @IsString()
    authorName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
}
