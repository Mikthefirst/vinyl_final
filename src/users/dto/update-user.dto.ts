import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserProfileDto {
    @ApiPropertyOptional({ example: 'John', description: 'First name' })
    first_name?: string;
    @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
    last_name?: string;
    @ApiPropertyOptional({
        example: '1990-01-01',
        description: 'Birth date (YYYY-MM-DD)'
    })
    birthdate?: Date;
    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'Avatar URL'
    })
    avatar_url?: string | null;
}
