import { IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetVinylsQueryDto {
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        example: 'price',
        enum: ['price', 'name', 'authorName', 'createdAt'],
        description: 'Sort field'
    })
    @IsOptional()
    @IsIn(['price', 'name', 'authorName', 'createdAt'])
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({
        example: 'DESC',
        enum: ['ASC', 'DESC'],
        description: 'Sort order'
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC' = 'DESC';

    @ApiPropertyOptional({ example: 1, description: 'Page number', minimum: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Items per page',
        minimum: 1
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 10;
}
