import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    ParseUUIDPipe,
    BadRequestException
} from '@nestjs/common';
import { VinylService } from './vinyls.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { GetVinylsQueryDto } from './dto/query-vinyl.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('vinyls')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Get()
    findAll(@Query() query: GetVinylsQueryDto) {
        return this.vinylService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string
    ) {
        return this.vinylService.findOne(id);
    }

    // ADMIN
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateVinylDto) {
        return this.vinylService.create(dto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string,
        @Body() dto: UpdateVinylDto
    ) {
        return this.vinylService.update(id, dto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new BadRequestException('Invalid UUID format')
            })
        )
        id: string
    ) {
        return this.vinylService.remove(id);
    }
}
