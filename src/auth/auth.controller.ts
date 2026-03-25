import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as interfaces from './interfaces/interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

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
    googleCallback(@Request() req: interfaces.RequestWithUser, @Res() res) {
        const token = this.authService.login(req.user);
        console.log('token: ', token);
        res.redirect('http://localhost:3000');
    }
}
