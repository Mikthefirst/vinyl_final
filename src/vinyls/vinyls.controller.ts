import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    ParseUUIDPipe,
    BadRequestException,
    Req
} from '@nestjs/common';
import { VinylService } from './vinyls.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { GetVinylsQueryDto } from './dto/query-vinyl.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import * as interfaces from 'src/auth//interfaces/interfaces';
import { QueryReviewsDto } from 'src/reviews/dto/query-reviews.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiParam,
    ApiBody
} from '@nestjs/swagger';

@ApiTags('vinyls')
@Controller('vinyls')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Get()
    @ApiOperation({ summary: 'Get all vinyls' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search by name or author'
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        enum: ['price', 'name', 'authorName', 'createdAt'],
        description: 'Sort field'
    })
    @ApiQuery({
        name: 'order',
        required: false,
        enum: ['ASC', 'DESC'],
        description: 'Sort order'
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
    @ApiResponse({ status: 200, description: 'Returns list of vinyls' })
    findAll(@Query() query: GetVinylsQueryDto) {
        return this.vinylService.findAll(query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get vinyls for authenticated user' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search by name or author'
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        enum: ['price', 'name', 'authorName', 'createdAt'],
        description: 'Sort field'
    })
    @ApiQuery({
        name: 'order',
        required: false,
        enum: ['ASC', 'DESC'],
        description: 'Sort order'
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
    @ApiResponse({
        status: 200,
        description: 'Returns list of vinyls with user reviews'
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAllForAuth(
        @Query() query: GetVinylsQueryDto,
        @Req() req: interfaces.RequestWithJwtUser
    ) {
        return this.vinylService.findAll(query, req.user.userId);
    }

    @Get('vinyl/:id/reviews')
    @ApiOperation({ summary: 'Get vinyl reviews' })
    @ApiParam({
        name: 'id',
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
    getVinylReviews(
        @Param('id', ParseUUIDPipe) vinylId: string,
        @Query() query: QueryReviewsDto
    ) {
        return this.vinylService.getVinylReviews(vinylId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get vinyl by ID' })
    @ApiParam({
        name: 'id',
        description: 'Vinyl UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ status: 200, description: 'Returns vinyl details' })
    @ApiResponse({ status: 404, description: 'Vinyl not found' })
    findOne(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string
    ) {
        return this.vinylService.findOne(id);
    }

    // ADMIN
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create vinyl (admin only)' })
    @ApiBody({ type: CreateVinylDto })
    @ApiResponse({ status: 201, description: 'Vinyl created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
    create(@Body() dto: CreateVinylDto) {
        return this.vinylService.create(dto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update vinyl (admin only)' })
    @ApiParam({
        name: 'id',
        description: 'Vinyl UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({ type: UpdateVinylDto })
    @ApiResponse({ status: 200, description: 'Vinyl updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
    @ApiResponse({ status: 404, description: 'Vinyl not found' })
    update(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string,
        @Body() dto: UpdateVinylDto
    ) {
        return this.vinylService.update(id, dto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete vinyl (admin only)' })
    @ApiParam({
        name: 'id',
        description: 'Vinyl UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ status: 200, description: 'Vinyl deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
    @ApiResponse({ status: 404, description: 'Vinyl not found' })
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
        return this.vinylService.remove(id);
    }
}
