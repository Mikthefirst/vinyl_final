import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { User } from './entity/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'Returns list of users',
        type: [User]
    })
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('make-admin')
    @ApiOperation({ summary: 'Make user admin by email' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'test@gmail.com' }
            }
        }
    })
    async makeAdmin(@Body('email') email: string): Promise<UserProfileDto> {
        return this.usersService.makeAdminByEmail(email);
    }
    @Post()
    @ApiOperation({ summary: 'Create new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'User created successfully',
        type: UserProfileDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async create(@Body() body: CreateUserDto): Promise<UserProfileDto> {
        return await this.usersService.create(body);
    }
}
