// auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as config from '@nestjs/config';
import { AuthService } from '../auth.service';
import { GoogleUserData } from '../interfaces/interfaces';

//гугл
export interface GoogleProfile {
    id: string;
    displayName: string;
    name: {
        familyName: string;
        givenName: string;
    };
    emails: Array<{
        value: string;
        verified: boolean;
    }>;
    photos: Array<{
        value: string;
    }>;
    provider: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: config.ConfigService,
        private authService: AuthService
    ) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL =
            configService.get<string>('GOOGLE_CALLBACK_URL') ||
            'http://localhost:3000/auth/google/callback';

        if (!clientID || !clientSecret)
            throw new Error('Error reading environment variables');

        super({
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: callbackURL,
            scope: ['email', 'profile']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ) {
        console.log('Google auth:\n', profile);

        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            throw new Error('No email found in Google profile');
        }

        if (!profile.name || !profile.name.givenName) {
            throw new Error('No name found in Google profile');
        }

        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName || '';

        try {
            const googleUserData: GoogleUserData = {
                google_id: profile.id,
                email: profile.emails[0].value,
                first_name: firstName,
                last_name: lastName,
                avatar_url: profile.photos?.[0]?.value
            };
            const user =
                await this.authService.validateGoogleUser(googleUserData);

            done(null, user);
        } catch (error) {
            console.error('Google validation error:', error);
            done(error, undefined);
        }
    }
}
