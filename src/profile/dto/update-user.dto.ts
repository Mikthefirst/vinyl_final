import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John', description: 'First name' })
    @IsOptional()
    @IsString()
    first_name?: string;
    @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
    @IsOptional()
    @IsString()
    last_name?: string;
    @ApiPropertyOptional({
        example: '1990-01-01',
        description: 'Birth date (YYYY-MM-DD)'
    })
    @IsOptional()
    @IsDateString()
    birthdate?: string;
    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'Avatar URL'
    })
    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'avatar_url must be a valid URL' })
    avatar_url?: string;
}
