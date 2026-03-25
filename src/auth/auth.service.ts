import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GoogleUserData } from './interfaces/interfaces';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}
    async validateUserByID(id: string): Promise<User | null> {
        const user = await this.userService.findOneByID(id);
        if (user) {
            return user;
        }
        return null;
    }

    async validateGoogleUser(
        googleUser: GoogleUserData
    ): Promise<UserProfileDto> {
        return await this.userService.createFromGoogle(googleUser);
    }

    login(user: User): { access_token: string } {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
