// src/purchases/purchases.controller.ts
import {
    Controller,
    Get,
    Query,
    UseGuards,
    Param,
    Req,
    BadRequestException,
    ParseUUIDPipe
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiParam
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}

@ApiTags('purchases')
@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchasesService: PurchaseService) {}

    @Get('success')
    @ApiOperation({ summary: 'Handle successful payment callback' })
    @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
    @ApiQuery({ name: 'vinyl_id', required: true, description: 'Vinyl ID' })
    @ApiQuery({
        name: 'quantity',
        required: true,
        description: 'Quantity purchased'
    })
    @ApiQuery({
        name: 'session_id',
        required: true,
        description: 'Stripe session ID'
    })
    @ApiResponse({ status: 200, description: 'Payment processed successfully' })
    @ApiResponse({ status: 400, description: 'Payment error' })
    async handleSuccess(
        @Query('userId') userId: string,
        @Query('vinyl_id') vinylId: string,
        @Query('quantity') quantity: string,
        @Query('session_id') sessionId: string
    ) {
        try {
            if (!userId || !vinylId || !quantity || !sessionId) {
                throw new Error('Missing required parameters');
            }

            await this.purchasesService.createPurchase(
                userId,
                vinylId,
                parseInt(quantity),
                sessionId
            );

            return { message: 'payment success' };
        } catch (error) {
            console.error('Success handler error:', error);
            throw new BadRequestException('Payment error');
        }
    }

    @Get('cancel')
    @ApiOperation({ summary: 'Handle canceled payment callback' })
    @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
    @ApiQuery({ name: 'vinyl_id', required: true, description: 'Vinyl ID' })
    @ApiQuery({
        name: 'quantity',
        required: true,
        description: 'Quantity purchased'
    })
    @ApiQuery({
        name: 'session_id',
        required: true,
        description: 'Stripe session ID'
    })
    @ApiResponse({ status: 200, description: 'Payment canceled' })
    @ApiResponse({ status: 400, description: 'Payment error' })
    async handleCancel(
        @Query('userId') userId: string,
        @Query('vinyl_id') vinylId: string,
        @Query('quantity') quantity: string,
        @Query('session_id') sessionId: string
    ) {
        try {
            // Сохраняем информацию об отмененной покупке
            await this.purchasesService.handleCancelPurchase(
                userId,
                vinylId,
                parseInt(quantity),
                sessionId
            );

            // Редиректим на фронтенд с информацией об отмене
            return { message: 'payment canselled' };
        } catch (error) {
            console.error('Cancel handler error:', error);
            throw new BadRequestException('Payment error');
        }
    }

    @Get('my-purchases')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user purchases' })
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
    @ApiResponse({ status: 200, description: 'Returns list of purchases' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(JwtAuthGuard)
    async getUserPurchases(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.purchasesService.findUserPurchases(
            req.user.id,
            page,
            limit
        );
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get purchase by ID' })
    @ApiParam({
        name: 'id',
        description: 'Purchase UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ status: 200, description: 'Returns purchase details' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Purchase not found' })
    @UseGuards(JwtAuthGuard)
    async getPurchase(
        @Req() req: RequestWithUser,
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string
    ) {
        return this.purchasesService.findOne(id, req.user.id);
    }

    @Get('check/:vinylId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if user purchased vinyl' })
    @ApiParam({
        name: 'vinylId',
        description: 'Vinyl UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ status: 200, description: 'Returns purchase status' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async checkPurchase(
        @Req() req: RequestWithUser,
        @Param(
            'vinylId',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        vinylId: string
    ) {
        const hasPurchased =
            await this.purchasesService.checkUserHasPurchasedVinyl(
                req.user.id,
                vinylId
            );
        return { hasPurchased };
    }
}
