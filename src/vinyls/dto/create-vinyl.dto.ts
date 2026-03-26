import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVinylDto {
    @ApiProperty({ example: 'Abbey Road', description: 'Vinyl name' })
    @IsString()
    name: string;
    @ApiProperty({ example: 'The Beatles', description: 'Author name' })
    @IsString()
    authorName: string;
    @ApiPropertyOptional({
        example: 'The eleventh studio album...',
        description: 'Description'
    })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({ example: 29.99, description: 'Price', minimum: 0 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({
        example: 'https://example.com/abbey-road.jpg',
        description: 'Image URL'
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({
        example: 50,
        description: 'Stock quantity',
        minimum: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
}
