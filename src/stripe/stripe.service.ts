import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

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

    async createPaymentIntent(amount: number, currency: string = 'usd') {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100, // Stripe работает с копейками/центами
                currency,
                automatic_payment_methods: {
                    enabled: true
                }
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            };
        } catch (error) {
            console.error('Stripe error:', error);
            throw error;
        }
    }

    async confirmPayment(paymentIntentId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
            return {
                id: paymentIntent.id,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret
            };
        } catch (error) {
            console.error('Stripe confirm error:', error);
            throw error;
        }
    }

    async getPaymentIntent(paymentIntentId: string) {
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            console.error('Stripe retrieve error:', error);
            throw error;
        }
    }

    async createCustomer(email: string, name?: string) {
        try {
            const customer = await this.stripe.customers.create({
                email,
                name,
            });
            return customer;
        } catch (error) {
            console.error('Stripe create customer error:', error);
            throw error;
        }
    }

    async createCheckoutSession(priceId: string, customerId?: string) {
        try {
            const session = await this.stripe.checkout.sessions.create({
                mode: 'payment',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                customer: customerId,
                success_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel',
            });
            return session;
        } catch (error) {
            console.error('Stripe create checkout session error:', error);
            throw error;
        }
    }
}
