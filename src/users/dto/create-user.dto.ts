import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsDateString,
    MaxLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'John',
        description: 'First name',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    first_name: string;
    @ApiProperty({
        example: 'Doe',
        description: 'Last name',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    last_name: string;
    @ApiProperty({
        example: '1990-01-01',
        description: 'Birth date (YYYY-MM-DD)'
    })
    @IsDateString()
    birthdate: Date;
    @ApiProperty({
        example: 'password123',
        description: 'Password',
        minLength: 4
    })
    @IsString()
    @MinLength(4)
    password: string;

    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'Avatar URL'
    })
    @IsOptional()
    @IsString()
    avatar_url?: string;
}
