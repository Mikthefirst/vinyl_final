import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({ example: 'usd', description: 'Currency code' })
    @IsString()
    currency: string;
    @ApiProperty({ example: 'Abbey Road', description: 'Vinyl name' })
    @IsString()
    vinyl_name: string;
    @ApiProperty({ example: 1, description: 'Quantity' })
    @IsNumber()
    quantity: number;
    @ApiProperty({ example: 29.99, description: 'Amount' })
    @IsNumber()
    amount: number;
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Vinyl ID'
    })
    @IsString()
    vinyl_id: string;
}
