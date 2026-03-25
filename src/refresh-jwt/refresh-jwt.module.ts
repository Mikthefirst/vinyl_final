import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const REFRESH_JWT = 'REFRESH_JWT';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('REFRESH_JWT_SECRET'),
                    signOptions: {
                        expiresIn: '1d'
                    }
                };
            },
            inject: [ConfigService]
        })
    ],
    providers: [
        {
            provide: REFRESH_JWT,
            useFactory: (jwtService: JwtService): JwtService => jwtService,
            inject: [JwtService]
        }
    ],
    exports: [REFRESH_JWT]
})
export class RefreshJwtModule {}
