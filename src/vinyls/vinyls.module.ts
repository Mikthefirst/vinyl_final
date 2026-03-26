import { Module } from '@nestjs/common';
import { VinylService } from './vinyls.service';
import { VinylController } from './vinyls.controller';
import { Vinyl } from './entities/vinyl.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Vinyl])],
    controllers: [VinylController],
    providers: [VinylService]
})
export class VinylsModule {}
