import {
    Controller,
    Get,
    Request,
    UseGuards,
    Post,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as interfaces from './interfaces/interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(
        @Request() req: interfaces.RequestWithJwtUser
    ): interfaces.AuthUser {
        return req.user;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    @ApiOperation({ summary: 'Google login redirect' })
    @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
    googleLogin() {}

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({ status: 302, description: 'Returns tokens' })
    async googleCallback(@Request() req: interfaces.RequestWithUser) {
        const token = await this.authService.login(req.user);
        console.log('token: ', token);
        return {
            access_token: token.access_token,
            refresh_token: token.refresh_token
        };
    }

    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Returns new tokens' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(@Request() req: interfaces.RequestWithJwtUser) {
        return await this.authService.refreshToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req: interfaces.RequestWithJwtUser) {
        await this.authService.logOut(req.user.email);
        return { message: 'Logged out successfully' };
    }
}
