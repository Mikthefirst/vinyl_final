import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadFinal } from '../interfaces/interfaces';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt'
) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {
        const secret = configService.get<string>('REFRESH_JWT_SECRET');

        if (!secret)
            throw new Error(
                'REFRESH_JWT_SECRET is not defined in environment variables'
            );

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
            passReqToCallback: true
        });
    }

    //записываем в req.user JwtPayload
    async validate(
        req: Request,
        payload: JwtPayload
    ): Promise<JwtPayloadFinal> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const refreshToken: string =
            req.headers.authorization?.replace('Bearer', '').trim() || '';
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }
        const user = await this.authService.validateRefreshToken(
            payload.email,
            refreshToken
        );
        return {
            userId: user.id,
            email: user.email,
            role: user.role
        };
    }
}
