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
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
    ApiQuery
} from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('vinyls/:vinylId/reviews')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create review for vinyl' })
    @ApiParam({
        name: 'vinylId',
        description: 'Vinyl UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({ type: CreateReviewDto })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Bad request' })
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
    @ApiOperation({ summary: 'Get reviews by vinyl' })
    @ApiParam({
        name: 'vinylId',
        description: 'Vinyl UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number',
        example: 1
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Items per page',
        example: 10
    })
    @ApiResponse({ status: 200, description: 'Returns list of reviews' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete own review' })
    @ApiParam({
        name: 'id',
        description: 'Review UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Review not found' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete any review (admin only)' })
    @ApiParam({
        name: 'id',
        description: 'Review UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
    @ApiResponse({ status: 404, description: 'Review not found' })
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
