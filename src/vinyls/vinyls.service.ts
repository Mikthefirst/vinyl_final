import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { GetVinylsQueryDto } from './dto/query-vinyl.dto';

@Injectable()
export class VinylService {
    constructor(
        @InjectRepository(Vinyl)
        private vinylRepo: Repository<Vinyl>
    ) {}

    async create(dto: CreateVinylDto) {
        const vinyl = this.vinylRepo.create(dto);
        return this.vinylRepo.save(vinyl);
    }

    async findAll(query: GetVinylsQueryDto) {
        const { search, sortBy, order, page, limit } = query;
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 10;

        const qb = this.vinylRepo.createQueryBuilder('vinyl');
        //search
        if (search) {
            qb.andWhere(
                new Brackets((qb) => {
                    qb.where('LOWER(vinyl.name) LIKE LOWER(:search)', {
                        search: `%${search}%`
                    }).orWhere('LOWER(vinyl.authorName) LIKE LOWER(:search)', {
                        search: `%${search}%`
                    });
                })
            );
        }

        //sort

        if (sortBy && ['price', 'name', 'authorName'].includes(sortBy)) {
            qb.orderBy(`vinyl.${sortBy}`, order);
        } else {
            qb.orderBy('vinyl.createdAt', 'DESC');
        }

        //pagination
        const skip = (currentPage - 1) * currentLimit;
        const take = currentLimit;
        qb.skip(skip).take(take);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        };
    }

    async findOne(id: string) {
        const vinyl = await this.vinylRepo.findOne({ where: { id } });
        if (!vinyl) throw new NotFoundException('Vinyl not found');

        return vinyl;
    }

    async update(id: string, dto: UpdateVinylDto) {
        const vinyl = await this.findOne(id);

        Object.assign(vinyl, {
            ...dto,
            ...(dto.price && { price: dto.price.toString() })
        });

        return this.vinylRepo.save(vinyl);
    }

    async remove(id: string) {
        const vinyl = await this.findOne(id);
        await this.vinylRepo.remove(vinyl);
        return { message: 'Deleted successfully' };
    }
}
