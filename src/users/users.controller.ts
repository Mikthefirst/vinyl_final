import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { User } from './entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    async create(@Body() body: CreateUserDto): Promise<UserProfileDto> {
        return await this.usersService.create(body);
    }
}
