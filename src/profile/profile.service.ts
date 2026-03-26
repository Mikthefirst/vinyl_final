import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileResponseDto } from './dto/profile-responce.dto';
import { plainToInstance } from 'class-transformer';
import { Review } from 'src/reviews/entities/review.entity';

export interface ReviewStats {
    totalReviews: string;
    averageScore: string;
}

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>
    ) {}

    async getProfile(userId: string): Promise<ProfileResponseDto> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return plainToInstance(ProfileResponseDto, user, {
            excludeExtraneousValues: true
        });
    }

    async updateProfile(
        userId: string,
        updateData: UpdateUserDto
    ): Promise<ProfileResponseDto> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Обновляем только разрешенные поля
        Object.assign(user, updateData);
        const updatedUser = await this.userRepo.save(user);

        return plainToInstance(ProfileResponseDto, updatedUser, {
            excludeExtraneousValues: true
        });
    }

    async deleteProfile(userId: string): Promise<{ message: string }> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepo.remove(user);

        return { message: 'Profile deleted successfully' };
    }

    async getUserStats(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Получаем статистику отзывов отдельным запросом
        const reviewsStats = await this.reviewRepo
            .createQueryBuilder('review')
            .select('COUNT(review.id)', 'totalReviews')
            .addSelect('AVG(review.score)', 'averageScore')
            .where('review.userId = :userId', { userId })
            .getRawOne<ReviewStats>();

        const totalReviews = Number(reviewsStats?.totalReviews) || 0;
        const averageScore = Number(reviewsStats?.averageScore) || 0;

        // Покупки пока нет, ставим 0
        const totalPurchases = 0;

        return {
            totalReviews,
            totalPurchases,
            averageReviewScore: Number(averageScore.toFixed(1)),
            memberSince: user.created_at,
            lastLogin: user.last_login_at || null
        };
    }
}
