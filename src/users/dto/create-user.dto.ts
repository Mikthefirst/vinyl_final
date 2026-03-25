/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsDateString,
    MaxLength
} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    first_name: string;
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    last_name: string;
    @IsDateString()
    birthdate: Date;
    @IsString()
    @MinLength(4)
    password: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;
}
