import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    Req,
    UseGuards,
    BadRequestException
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/enums/role.enum';
import * as interfaces from 'src/auth/interfaces/interfaces';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('vinyls/:vinylId/reviews')
    create(
        @Param(
            'vinylId',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        vinylId: string,
        @Body() dto: CreateReviewDto,
        @Req() req: interfaces.RequestWithJwtUser
    ) {
        const userId = req.user.userId;
        if (!userId) throw new BadRequestException('Error with token');
        return this.reviewsService.create(vinylId, userId, dto);
    }

    @Get('vinyls/:vinylId/reviews')
    findByVinyl(
        @Param(
            'vinylId',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        vinylId: string,
        @Query() query: QueryReviewsDto
    ) {
        return this.reviewsService.findByVinyl(vinylId, query);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('my/:id')
    async removeMy(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string,
        @Req() req: interfaces.RequestWithJwtUser
    ) {
        const userId = req.user.userId;
        if (!userId) throw new BadRequestException('Error with token');

        return this.reviewsService.removeUserReview(id, userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete('reviews/:id')
    remove(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string
    ) {
        return this.reviewsService.remove(id);
    }
}
