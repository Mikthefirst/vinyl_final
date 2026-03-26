import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsString()
    currency: string;

    @IsString()
    vinyl_name: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    amount: number;

    @IsString()
    vinyl_id: string;
}
