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

interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchasesService: PurchaseService) {}

    @Get('success')
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
