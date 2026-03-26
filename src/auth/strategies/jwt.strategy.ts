import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadFinal } from '../interfaces/interfaces';
import { AuthService } from '../auth.service';
import { UserRole } from '../enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret)
            throw new Error(
                'JWT_SECRET is not defined in environment variables'
            );

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret
        });
    }

    private mapToUserRole(role: string): UserRole {
        switch (role) {
            case 'admin':
                return UserRole.ADMIN;
            case 'user':
                return UserRole.USER;
            default:
                return UserRole.USER; // throw new Error(`Invalid role: ${role}`)
        }
    }
    //записываем в req.user JwtPayload
    async validate(payload: JwtPayload): Promise<JwtPayloadFinal> {
        console.log('JwtStrategy payload:', payload); // 👈 Добавьте лог
        const user = await this.authService.validateUserByID(payload.sub);

        if (!user) throw new UnauthorizedException('User no longer exists');

        const result = {
            userId: payload.sub,
            email: payload.email,
            role: this.mapToUserRole(payload.role),
            firstName: user.first_name,
            lastName: user.last_name
        };
        console.log('JwtStrategy.validate returning:', result);
        return result;
    }
}
