import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request, Response } from 'express';

import { AuthService } from '../auth.service';
import { EnvService } from '../../env/env.service';
import { ACCESS_COOKIE, AccessPayload } from '../types';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[ACCESS_COOKIE],
      secretOrKey: envService.get('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  validate(accessPayload: AccessPayload) {
    return accessPayload;
  }
}
