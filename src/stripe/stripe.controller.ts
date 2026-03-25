import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create-payment-intent')
    async createPaymentIntent(
        @Body() body: { amount: number; currency?: string }
    ) {
        return this.stripeService.createPaymentIntent(
            body.amount,
            body.currency || 'usd'
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('confirm-payment/:paymentIntentId')
    async confirmPayment(@Param('paymentIntentId') paymentIntentId: string) {
        return this.stripeService.confirmPayment(paymentIntentId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('payment-intent/:paymentIntentId')
    async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
        return this.stripeService.getPaymentIntent(paymentIntentId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-customer')
    async createCustomer(@Body() body: { email: string; name?: string }) {
        return this.stripeService.createCustomer(body.email, body.name);
    }
}
