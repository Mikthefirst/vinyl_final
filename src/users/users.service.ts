import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { GoogleUserData } from 'src/auth/interfaces/interfaces';
import { UserRole } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
    async create(data: CreateUserDto): Promise<UserProfileDto> {
        const existingUser = await this.userRepo.findOne({
            where: { email: data.email }
        });
        if (existingUser)
            throw new BadRequestException('This user already exist');

        const user = this.userRepo.create(data);

        const savedUser = await this.userRepo.save(user);
        return this.toUserProfileDto(savedUser);
    }

    async createFromGoogle(data: GoogleUserData): Promise<UserProfileDto> {
        const user = await this.findOneByEmail(data.email);

        if (user) {
            if (!user.google_id) {
                await this.userRepo.update(user.id, {
                    google_id: data.google_id,
                    provider: 'google',
                    avatar_url: data.avatar_url || user.avatar_url,
                    is_email_verified: true
                });
                const updatedUser = await this.userRepo.findOneBy({
                    id: user.id
                });
                if (!updatedUser) {
                    throw new Error('User not found after update');
                }
                return this.toUserProfileDto(updatedUser);
            }
            return this.toUserProfileDto(user);
        }

        const avatarUrl = data.avatar_url || undefined;

        const newUser = this.userRepo.create({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            avatar_url: avatarUrl,
            google_id: data.google_id,
            provider: 'google',
            is_email_verified: true,
            role: UserRole.USER
        });

        const savedUser = await this.userRepo.save(newUser);
        return this.toUserProfileDto(savedUser);
    }
    async findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOneBy({ email: email });
    }

    async findOneByID(id: string): Promise<User | null> {
        return this.userRepo.findOneBy({ id: id });
    }

    async updateRefreshToken(
        email: string,
        hashed_refresh_token: string
    ): Promise<UpdateResult> {
        const user = await this.findOneByEmail(email);
        if (!user) throw new BadRequestException('User not found');

        return await this.userRepo.update(
            { email: email },
            { hashed_refresh_token: hashed_refresh_token }
        );
    }

    async updateLastLogin(email: string) {
        await this.userRepo.update(
            { email: email },
            { last_login_at: () => 'CURRENT_TIMESTAMP' }
        );
    }
    //private func
    private toUserProfileDto(user: User): UserProfileDto {
        const profileDto = new UserProfileDto();
        profileDto.email = user.email;
        profileDto.first_name = user.first_name;
        profileDto.last_name = user.last_name;
        profileDto.birthdate = user.birthdate;
        profileDto.avatar_url = user.avatar_url || null;
        profileDto.created_at = user.created_at;

        return profileDto;
    }
}
