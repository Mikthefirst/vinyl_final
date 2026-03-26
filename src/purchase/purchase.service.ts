// src/purchases/purchases.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { StripeService } from '../stripe/stripe.service';
import { VinylService } from 'src/vinyls/vinyls.service';
import { sendProfileUpdateMail } from 'src/utils/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private purchasesRepository: Repository<Purchase>,
        private stripeService: StripeService,
        private vinylsServ: VinylService,
        private usersService: UsersService
    ) {}

    async createPurchase(
        userId: string,
        vinylId: string,
        quantity: number,
        sessionId: string
    ): Promise<Purchase> {
        // Получаем сессию из Stripe для проверки статуса платежа
        const session = await this.stripeService.getCheckoutSession(sessionId);

        // Проверяем статус платежа
        if (session.payment_status !== 'paid') {
            throw new BadRequestException('Payment not completed');
        }

        // Получаем payment_intent_id из сессии
        const paymentIntentId = session.payment_intent as string;

        if (!paymentIntentId) {
            throw new BadRequestException('Payment intent not found');
        }

        // Проверяем, не существует ли уже покупка с таким payment_intent_id
        const existingPurchase = await this.purchasesRepository.findOne({
            where: { stripePaymentIntentId: paymentIntentId }
        });

        if (existingPurchase) {
            throw new BadRequestException('Purchase already exists');
        }

        const vinyl = await this.vinylsServ.decreaseStock(vinylId, quantity);
        if (!vinyl) throw new BadRequestException('Vinyl not found');

        // Проверяем, не купил ли пользователь уже этот винил
        const hasPurchased =
            await this.checkUserHasPaymentIntent(paymentIntentId);
        if (hasPurchased) {
            throw new BadRequestException(
                'You have already purchased this vinyl'
            );
        }

        // Создаем новую покупку
        const purchase = this.purchasesRepository.create({
            userId: userId,
            vinylId: vinylId,
            stripePaymentIntentId: paymentIntentId,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'usd',
            status: 'succeeded',
            metadata: {
                sessionId: sessionId,
                quantity: quantity,
                stripeSessionStatus: session.status,
                paymentStatus: session.payment_status
            }
        });

        const user = await this.usersService.findOneByID(userId);
        if (!user) throw new BadRequestException('User not found');

        const userText = `Your payment for "${vinyl.name}" has been successfully processed.\n\nPurchase Details:\n- Vinyl: ${vinyl.name} by ${vinyl.authorName}\n- Quantity: ${quantity}\n- Amount: ${purchase.amount} ${purchase.currency.toUpperCase()}\n\nThank you for your purchase!\n\n`;

        await sendProfileUpdateMail(
            user.email,
            'Payment Successful - Vinyl Purchase Confirmation',
            userText
        );

        const savedPurchase = await this.purchasesRepository.save(purchase);
        return savedPurchase;
    }

    async handleCancelPurchase(
        userId: string,
        vinylId: string,
        quantity: number,
        sessionId: string
    ): Promise<void> {
        const session = await this.stripeService.getCheckoutSession(sessionId);

        if (session.payment_status !== 'paid') {
            throw new BadRequestException('Payment not completed');
        }

        const paymentIntentId = session.payment_intent as string;

        if (!paymentIntentId) {
            throw new BadRequestException('Payment intent not found');
        }
        const failedPurchase = this.purchasesRepository.create({
            userId: userId,
            vinylId: vinylId,
            stripePaymentIntentId: paymentIntentId,
            amount: 0,
            currency: 'usd',
            status: 'failed',
            metadata: {
                canceledAt: new Date().toISOString(),
                quantity: quantity,
                reason: 'User canceled payment'
            }
        });

        await this.purchasesRepository.save(failedPurchase);
    }

    async findUserPurchases(
        userId: string,
        page: number = 1,
        limit: number = 10
    ) {
        const skip = (page - 1) * limit;

        const [purchases, total] = await this.purchasesRepository.findAndCount({
            where: { userId, status: 'succeeded' },
            relations: ['vinyl', 'user'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit
        });

        return {
            data: purchases,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findOne(id: string, userId?: string): Promise<Purchase> {
        const purchase = await this.purchasesRepository.findOne({
            where: { id },
            relations: ['vinyl', 'user']
        });

        if (!purchase) {
            throw new NotFoundException('Purchase not found');
        }

        if (userId && purchase.userId !== userId) {
            throw new BadRequestException(
                'You can only view your own purchases'
            );
        }

        return purchase;
    }

    async checkUserHasPaymentIntent(paymentIntentId: string): Promise<boolean> {
        const purchase = await this.purchasesRepository.findOne({
            where: { stripePaymentIntentId: paymentIntentId }
        });
        return !!purchase;
    }

    async checkUserHasPurchasedVinyl(
        userId: string,
        vinylId: string
    ): Promise<Purchase[]> {
        const purchases = await this.purchasesRepository.find({
            where: {
                userId,
                vinylId,
                status: 'succeeded'
            }
        });

        return purchases;
    }
    async getUserPurchasedVinyls(userId: string): Promise<string[]> {
        const purchases = await this.purchasesRepository.find({
            where: { userId, status: 'succeeded' },
            select: ['vinylId']
        });

        return purchases.map((p) => p.vinylId);
    }
}
