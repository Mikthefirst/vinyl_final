import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshJwtModule } from 'src/refresh-jwt/refresh-jwt.module';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: configService.get('JWT_EXPIRE_IN') }
            }),
            inject: [ConfigService]
        }),
        RefreshJwtModule
    ],
    providers: [AuthService, JwtStrategy, GoogleStrategy, RefreshJwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
