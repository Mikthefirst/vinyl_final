import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({ example: 'Great album!', description: 'Review comment' })
    @IsString()
    comment: string;

    @ApiProperty({
        example: 5,
        description: 'Review score (1-5)',
        minimum: 1,
        maximum: 5
    })
    @IsInt()
    @Min(1)
    @Max(5)
    score: number;
}
