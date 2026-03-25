import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateGoogleUserDto {
    @IsEmail()
    email: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsString()
    google_id: string;

    @IsOptional()
    @IsString()
    provider?: string;

    @IsOptional()
    @IsBoolean()
    is_email_verified?: boolean;
}
