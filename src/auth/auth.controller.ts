import { Controller, Get, Request, Res, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as interfaces from './interfaces/interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(
        @Request() req: interfaces.RequestWithJwtUser
    ): interfaces.AuthUser {
        return req.user;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    googleLogin() {}

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(
        @Request() req: interfaces.RequestWithUser,
        @Res() res
    ) {
        const token = await this.authService.login(req.user);
        console.log('token: ', token);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return res.redirect(
            `http://localhost:3000?access_token=${token.access_token}&refresh_token=${token.refresh_token}`
        );
    }
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    async refreshToken(@Request() req: interfaces.RequestWithJwtUser) {
        return await this.authService.refreshToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Request() req: interfaces.RequestWithJwtUser) {
        this.authService.logOut(req.user.userId);
    }
}
