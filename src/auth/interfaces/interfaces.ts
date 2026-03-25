import { User } from 'src/users/entity/user.entity';

export type AuthUser = {
    userId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
};

export interface RequestWithUser extends Request {
    user: User;
}

export interface RequestWithJwtUser extends Request {
    user: AuthUser;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

export interface GoogleUserData {
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    google_id: string;
}
