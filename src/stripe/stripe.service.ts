import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SK_KEY');

        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }

        this.stripe = new Stripe(secretKey);
    }

    async createCheckoutSession(
        createStripeDto: CreatePaymentDto,
        userId: string
    ) {
        try {
            const successUrl = `http://localhost:3000/purchase/success?userId=${encodeURIComponent(
                userId
            )}&vinyl_id=${encodeURIComponent(
                createStripeDto.vinyl_id
            )}&quantity=${encodeURIComponent(createStripeDto.quantity)}&session_id={CHECKOUT_SESSION_ID}`;

            const cancelUrl = `http://localhost:3000/purchase/cancel?userId=${encodeURIComponent(
                userId
            )}&vinyl_id=${encodeURIComponent(
                createStripeDto.vinyl_id
            )}&quantity=${encodeURIComponent(createStripeDto.quantity)}&session_id={CHECKOUT_SESSION_ID}`;

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: createStripeDto.currency,
                            product_data: {
                                name: createStripeDto.vinyl_name
                            },
                            unit_amount: Number(createStripeDto.amount) * 100
                        },
                        quantity: createStripeDto.quantity
                    }
                ],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl
            });

            return session;
        } catch {
            throw new BadRequestException('Failed to create payment session');
        }
    }

    async getCheckoutSession(
        sessionId: string
    ): Promise<Stripe.Checkout.Session> {
        try {
            const session =
                await this.stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch {
            throw new BadRequestException('Failed to retrieve payment session');
        }
    }
}
