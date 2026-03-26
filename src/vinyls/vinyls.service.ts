import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { GetVinylsQueryDto } from './dto/query-vinyl.dto';
import { Review } from 'src/reviews/entities/review.entity';
import { UsersService } from 'src/users/users.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { QueryReviewsDto } from 'src/reviews/dto/query-reviews.dto';

@Injectable()
export class VinylService {
    constructor(
        @InjectRepository(Vinyl)
        private vinylRepo: Repository<Vinyl>,
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        private userService: UsersService,
        private reviewsService: ReviewsService
    ) {}

    async create(dto: CreateVinylDto) {
        const vinyl = this.vinylRepo.create(dto);
        return this.vinylRepo.save(vinyl);
    }

    async findAll(query: GetVinylsQueryDto, currentUserId?: string) {
        const { search, sortBy, order, page = 1, limit = 10 } = query;
        const currentPage = Number(page);
        const currentLimit = Math.min(Number(limit), 100);

        const qb = this.vinylRepo
            .createQueryBuilder('vinyl')
            .leftJoinAndSelect('vinyl.reviews', 'reviews');

        if (search) {
            qb.andWhere(
                new Brackets((qb) => {
                    qb.where('LOWER(vinyl.name) LIKE LOWER(:search)', {
                        search: `%${search}%`
                    }).orWhere('LOWER(vinyl.authorName) LIKE LOWER(:search)', {
                        search: `%${search}%`
                    });
                })
            );
        }

        const [vinyls, total] = await qb
            .orderBy(
                sortBy && ['price', 'name', 'authorName'].includes(sortBy)
                    ? `vinyl.${sortBy}`
                    : 'vinyl.createdAt',
                order || 'DESC'
            )
            .skip((currentPage - 1) * currentLimit)
            .take(currentLimit)
            .getManyAndCount();

        const dataWithStats = await Promise.all(
            vinyls.map(async (vinyl) => {
                const reviews = vinyl.reviews || [];

                // Фильтруем отзывы другого пользователя
                const otherUserReviews = currentUserId
                    ? reviews.filter((r) => r.userId !== currentUserId)
                    : reviews;

                // Сортируем по старине
                const sortedOtherReviews = [...otherUserReviews].sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );

                // Первый отзыв другого пользователя
                const firstReview =
                    sortedOtherReviews.length > 0
                        ? sortedOtherReviews[0]
                        : null;

                // Средняя оценка
                const avgScore = reviews.length
                    ? reviews.reduce((sum, r) => sum + r.score, 0) /
                      reviews.length
                    : 0;

                let user_email: string | undefined;

                if (firstReview?.userId) {
                    const user = await this.userService.findOneByID(
                        firstReview.userId
                    );
                    if (user) {
                        user_email = user.email;
                    }
                }

                return {
                    id: vinyl.id,
                    name: vinyl.name,
                    authorName: vinyl.authorName,
                    description: vinyl.description,
                    price: vinyl.price,
                    imageUrl: vinyl.imageUrl,
                    stock: vinyl.stock,
                    isAvailable: vinyl.isAvailable,
                    createdAt: vinyl.createdAt,
                    updatedAt: vinyl.updatedAt,
                    averageScore: Number(avgScore.toFixed(1)),
                    firstReview: firstReview
                        ? {
                              score: firstReview.score,
                              comment: firstReview.comment,
                              email: user_email,
                              createdAt: firstReview.createdAt
                          }
                        : null
                };
            })
        );

        return {
            data: dataWithStats,
            meta: {
                total,
                page: currentPage,
                limit: currentLimit,
                lastPage: Math.ceil(total / currentLimit)
            }
        };
    }

    async findOne(id: string) {
        const vinyl = await this.vinylRepo.findOne({ where: { id } });
        if (!vinyl) throw new NotFoundException('Vinyl not found');

        return vinyl;
    }

    async getVinylReviews(vinylId: string, query: QueryReviewsDto) {
        const vinyl = await this.vinylRepo.findOne({ where: { id: vinylId } });
        if (!vinyl) throw new NotFoundException('Vinyl not found');
        return this.reviewsService.findByVinyl(vinylId, query);
    }

    async update(id: string, dto: UpdateVinylDto) {
        const vinyl = await this.findOne(id);

        Object.assign(vinyl, {
            ...dto,
            ...(dto.price && { price: dto.price.toString() })
        });

        return this.vinylRepo.save(vinyl);
    }

    async remove(id: string) {
        const vinyl = await this.findOne(id);
        await this.vinylRepo.remove(vinyl);
        return { message: 'Deleted successfully' };
    }
}
