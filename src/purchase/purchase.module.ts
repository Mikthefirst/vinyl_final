// src/purchases/purchases.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './entities/purchase.entity';
import { StripeModule } from '../stripe/stripe.module';
import { VinylsModule } from 'src/vinyls/vinyls.module';

@Module({
    imports: [TypeOrmModule.forFeature([Purchase]), StripeModule, VinylsModule],
    controllers: [PurchaseController],
    providers: [PurchaseService],
    exports: [PurchaseService]
})
export class PurchaseModule {}
