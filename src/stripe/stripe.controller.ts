import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as interfaces from 'src/auth/interfaces/interfaces';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create-payment')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create Stripe payment session' })
    @ApiBody({ type: CreatePaymentDto })
    @ApiResponse({
        status: 200,
        description: 'Returns Stripe checkout URL',
        schema: {
            example: {
                checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_...'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
