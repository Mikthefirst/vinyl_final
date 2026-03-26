import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Vinyl } from 'src/vinyls/entities/vinyl.entity';

@Module({
    imports: [ReviewsModule, TypeOrmModule.forFeature([Review, Vinyl])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService]
})
export class ReviewsModule {}
