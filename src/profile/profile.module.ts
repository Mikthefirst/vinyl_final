import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from '../users/entity/user.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Review])],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService]
})
export class ProfileModule {}
