import { Expose, Type } from 'class-transformer';
import { UserRole } from '../../auth/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewInProfileDto {
    @ApiProperty({ example: 'uuid', description: 'Review ID' })
    @Expose()
    id: string;
    @ApiProperty({ example: 5, description: 'Review score' })
    @Expose()
    score: number;

    @ApiProperty({ example: 'Great album!', description: 'Review comment' })
    @Expose()
    comment: string;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Creation date'
    })
    @Expose()
    @Type(() => Date)
    createdAt: Date;
}

export class PurchaseInProfileDto {
    @ApiProperty({ example: 'uuid', description: 'Purchase ID' })
    @Expose()
    id: string;
    @ApiProperty({ example: 'uuid', description: 'Vinyl ID' })
    @Expose()
    vinylId: string;
    @ApiProperty({ example: 'Abbey Road', description: 'Vinyl name' })
    @Expose()
    vinylName: string;
    @ApiProperty({ example: 'The Beatles', description: 'Vinyl author' })
    @Expose()
    vinylAuthorName: string;
    @ApiPropertyOptional({
        example: 'https://example.com/image.jpg',
        description: 'Vinyl image URL'
    })
    @Expose()
    vinylImageUrl: string;
    @ApiProperty({ example: 29.99, description: 'Purchase amount' })
    @Expose()
    amount: number;
    @ApiProperty({ example: 'usd', description: 'Currency' })
    @Expose()
    currency: string;
    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Purchase date'
    })
    @Expose()
    @Type(() => Date)
    purchasedAt: Date;
}

export class ProfileResponseDto {
    @ApiProperty({ example: 'uuid', description: 'User ID' })
    @Expose()
    id: string;
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @Expose()
    email: string;
    @ApiPropertyOptional({ example: 'John', description: 'First name' })
    @Expose()
    first_name?: string;

    @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
    @Expose()
    last_name?: string;
    @ApiPropertyOptional({ example: '1990-01-01', description: 'Birth date' })
    @Expose()
    birthdate?: Date;
    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'Avatar URL'
    })
    @Expose()
    avatar_url?: string;
    @ApiProperty({ enum: UserRole, example: 'user', description: 'User role' })
    @Expose()
    role: UserRole;
    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Registration date'
    })
    @Expose()
    created_at: Date;
    @ApiPropertyOptional({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Last login date'
    })
    @Expose()
    last_login_at?: Date;
    @ApiProperty({ type: [ReviewInProfileDto], description: 'User reviews' })
    @Expose()
    @Type(() => ReviewInProfileDto)
    reviews: ReviewInProfileDto[];
    @ApiProperty({
        type: [PurchaseInProfileDto],
        description: 'User purchases'
    })
    @Expose()
    @Type(() => PurchaseInProfileDto)
    purchases: PurchaseInProfileDto[];
}
