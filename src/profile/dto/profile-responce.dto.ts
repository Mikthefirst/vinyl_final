import { Expose } from 'class-transformer';
import { UserRole } from '../../auth/enums/role.enum';

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
}
