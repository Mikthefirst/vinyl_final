import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    BadRequestException
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as interfaces from '../auth/interfaces/interfaces';
import { ProfileResponseDto } from './dto/profile-responce.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    async getProfile(
        @Request() req: interfaces.RequestWithJwtUser
    ): Promise<ProfileResponseDto> {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        return this.profileService.getProfile(userId);
    }

    @Get('stats')
    async getUserStats(@Request() req: interfaces.RequestWithJwtUser): Promise<{
        totalReviews: number;
        totalPurchases: number;
        averageReviewScore: number;
        memberSince: Date;
        lastLogin: Date | null;
    }> {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        return this.profileService.getUserStats(userId);
    }

    @Patch()
    async updateProfile(
        @Request() req: interfaces.RequestWithJwtUser,
        @Body() updateData: UpdateUserDto
    ): Promise<ProfileResponseDto> {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        return this.profileService.updateProfile(userId, updateData);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async deleteProfile(
        @Request() req: interfaces.RequestWithJwtUser
    ): Promise<{ message: string }> {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        await this.profileService.deleteProfile(userId);
        return { message: 'profile deleted succesfully' };
    }
}
