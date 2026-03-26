import { IsOptional, IsString, IsDateString, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsDateString()
    birthdate?: string;

    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'avatar_url must be a valid URL' })
    avatar_url?: string;
}
