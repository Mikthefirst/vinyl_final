export class UserProfileDto {
    email: string;
    first_name: string;
    last_name: string;
    birthdate: Date;
    avatar_url?: string | null;
    created_at: Date;
}
