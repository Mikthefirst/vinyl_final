import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GoogleUserData } from './interfaces/interfaces';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import * as interfaces from './interfaces/interfaces';
import { REFRESH_JWT } from 'src/refresh-jwt/refresh-jwt.module';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @Inject(REFRESH_JWT) private refreshJwtService: JwtService
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

    async login(
        user: User
    ): Promise<{ access_token: string; refresh_token: string }> {
        const { access_token, refresh_token } = await this.generateTokens({
            sub: user.id,
            email: user.email,
            role: user.role
        });
        const hashed_refresh_token = await bcrypt.hash(refresh_token, 8);
        const result = await this.userService.updateRefreshToken(
            user.email,
            hashed_refresh_token
        );
        console.log('updated user with refresh token:', result);
        await this.userService.updateLastLogin(user.email);
        return {
            access_token: access_token,
            refresh_token: refresh_token
        };
    }

    async refreshToken(
        user: interfaces.AuthUser
    ): Promise<{ access_token: string; refresh_token: string }> {
        const { access_token, refresh_token } = await this.generateTokens({
            sub: user.userId,
            email: user.email,
            role: user.role
        });
        const hashed_refresh_token = await bcrypt.hash(refresh_token, 8);
        await this.userService.updateRefreshToken(
            user.email,
            hashed_refresh_token
        );
        return {
            access_token: access_token,
            refresh_token: refresh_token
        };
    }

    async generateTokens(
        user: interfaces.JwtPayload
    ): Promise<{ access_token: string; refresh_token: string }> {
        const payload: interfaces.JwtPayload = {
            email: user.email,
            sub: user.sub,
            role: user.role
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.refreshJwtService.signAsync(payload)
        ]);

        return { access_token, refresh_token };
    }

    async validateRefreshToken(
        email: string,
        refreshToken: string
    ): Promise<User> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) throw new UnauthorizedException('User no longer exists');

        if (!user.hashed_refresh_token)
            throw new UnauthorizedException('No refresh token found');

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.hashed_refresh_token
        );

        if (!isRefreshTokenValid)
            throw new UnauthorizedException('Invalid refresh token');

        return user;
    }

    async logOut(email: string) {
        await this.userService.updateRefreshToken(email, '');
    }
}
