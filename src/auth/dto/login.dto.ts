import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDTO {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address'
    })
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'password123',
        description: 'User password',
        minLength: 4,
        maxLength: 255
    })
    @IsString()
    @Length(4, 255)
    password: string;
}
