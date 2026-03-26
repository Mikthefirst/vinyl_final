import { Module } from '@nestjs/common';
import { VinylService } from './vinyls.service';
import { VinylController } from './vinyls.controller';
import { Vinyl } from './entities/vinyl.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/reviews/entities/review.entity';
import { UsersModule } from 'src/users/users.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
@Module({
    imports: [
        ReviewsModule,
        UsersModule,
        TypeOrmModule.forFeature([Vinyl, Review])
    ],
    controllers: [VinylController],
    providers: [VinylService],
    exports: [VinylService]
})
export class VinylsModule {}
