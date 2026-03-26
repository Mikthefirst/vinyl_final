import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoogleUserDto {
    @ApiProperty({ example: 'user@gmail.com', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John', description: 'First name' })
    @IsString()
    first_name: string;
    @ApiProperty({ example: 'Doe', description: 'Last name' })
    @IsString()
    last_name: string;

    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'Avatar URL'
    })
    @IsOptional()
    @IsString()
    avatar_url?: string;

    @ApiProperty({ example: '1234567890', description: 'Google ID' })
    @IsString()
    google_id: string;

    @ApiPropertyOptional({ example: 'google', description: 'Auth provider' })
    @IsOptional()
    @IsString()
    provider?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Email verified status'
    })
    @IsOptional()
    @IsBoolean()
    is_email_verified?: boolean;
}
