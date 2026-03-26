import { UserRole } from 'src/auth/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    email: string;
    @ApiProperty({ example: 'John', description: 'First name' })
    first_name: string;
    @ApiProperty({ example: 'Doe', description: 'Last name' })
    last_name: string;
    @ApiProperty({ example: '1990-01-01', description: 'Birth date' })
    birthdate: Date;
    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'Avatar URL'
    })
    avatar_url?: string | null;
    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Creation date'
    })
    created_at: Date;
    @ApiProperty({ example: 'uuid', description: 'User ID' })
    id: string;
    @ApiProperty({ enum: UserRole, example: 'user', description: 'User role' })
    role: UserRole;
}
