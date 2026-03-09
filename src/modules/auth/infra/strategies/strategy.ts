/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('SECRET_KEY'),
    });
  }

  validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
