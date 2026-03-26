import { Expose, Type } from 'class-transformer';
import { UserRole } from '../../auth/enums/role.enum';

export class ReviewInProfileDto {
    @Expose()
    id: string;

    @Expose()
    score: number;

    @Expose()
    comment: string;

    @Expose()
    @Type(() => Date)
    createdAt: Date;
}

export class PurchaseInProfileDto {
    @Expose()
    id: string;

    @Expose()
    vinylId: string;

    @Expose()
    vinylName: string;

    @Expose()
    vinylAuthorName: string;

    @Expose()
    vinylImageUrl: string;

    @Expose()
    amount: number;

    @Expose()
    currency: string;

    @Expose()
    @Type(() => Date)
    purchasedAt: Date;
}

export class ProfileResponseDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    first_name?: string;

    @Expose()
    last_name?: string;

    @Expose()
    birthdate?: Date;

    @Expose()
    avatar_url?: string;

    @Expose()
    role: UserRole;

    @Expose()
    created_at: Date;

    @Expose()
    last_login_at?: Date;

    @Expose()
    @Type(() => ReviewInProfileDto)
    reviews: ReviewInProfileDto[];

    @Expose()
    @Type(() => PurchaseInProfileDto)
    purchases: PurchaseInProfileDto[];
}
