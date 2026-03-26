import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as interfaces from 'src/auth/interfaces/interfaces';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create-payment')
    async createPaymentIntent(
        @Body() body: CreatePaymentDto,
        @Req() req: interfaces.RequestWithJwtUser
    ) {
        const session = await this.stripeService.createCheckoutSession(
            body,
            req.user.userId
        );
        return {
            checkoutUrl: session.url
        };
    }
}
