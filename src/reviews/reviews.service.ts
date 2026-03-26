import {
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Vinyl } from '../vinyls/entities/vinyl.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        @InjectRepository(Vinyl)
        private readonly vinylRepo: Repository<Vinyl>
    ) {}

    ///
    ///
    ///Убрать id
    ///"id": "95238e92-1df6-4b22-86d1-0c632b5291f5",
    ///"vinylId": "73f86704-69c6-48b9-a996-2cc221bb0bb2",
    ///"userId": "2a9eee96-8aa3-458b-b170-1446c46da0ba",
    ///
    async create(vinylId: string, userId: string, dto: CreateReviewDto) {
        const vinyl = await this.vinylRepo.findOne({ where: { id: vinylId } });

        if (!vinyl) {
            throw new NotFoundException('Vinyl not found');
        }

        const review = this.reviewRepo.create({
            vinylId,
            userId,
            comment: dto.comment,
            score: dto.score
        });

        return this.reviewRepo.save(review);
    }

    async findByVinyl(vinylId: string, query: QueryReviewsDto) {
        const vinyl = await this.vinylRepo.findOne({ where: { id: vinylId } });

        if (!vinyl) {
            throw new NotFoundException('Vinyl not found');
        }

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        const qb = this.reviewRepo
            .createQueryBuilder('review')
            .where('review.vinylId = :vinylId', { vinylId })
            .orderBy('review.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        };
    }

    async remove(id: string) {
        const review = await this.reviewRepo.findOne({ where: { id } });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.reviewRepo.remove(review);

        return { message: 'Review deleted successfully' };
    }

    async removeUserReview(id: string, userId: string) {
        const review = await this.reviewRepo.findOne({
            where: { id },
            relations: ['vinyl']
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.userId !== userId)
            throw new ForbiddenException(
                'You can only delete your own reviews'
            );

        await this.reviewRepo.remove(review);

        return {
            message: 'Review deleted successfully',
            reviewId: id
        };
    }
}
