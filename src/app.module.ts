import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RefreshJwtModule } from './refresh-jwt/refresh-jwt.module';
import { StripeModule } from './stripe/stripe.module';
import { VinylsModule } from './vinyls/vinyls.module';
import { Vinyl } from './vinyls/entities/vinyl.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { ProfileModule } from './profile/profile.module';
import { PurchaseModule } from './purchase/purchase.module';
import { Purchase } from './purchase/entities/purchase.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_DB'),
                entities: [User, Vinyl, Review, Purchase],
                synchronize: true,
                logging: true,
                maxQueryExecutionTime: 100
            }),
            inject: [ConfigService]
        }),
        UsersModule,
        AuthModule,
        RefreshJwtModule,
        StripeModule,
        VinylsModule,
        ReviewsModule,
        ProfileModule,
        PurchaseModule
    ]
})
export class AppModule {}
