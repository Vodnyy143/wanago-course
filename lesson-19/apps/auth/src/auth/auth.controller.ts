import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Cookie, CurrentUser, Public } from '@app/common';
import { UserEntity } from '../users/entities/user.entity';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './types';
import { cookieLib } from '@app/common/factories/cookie.lib';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(dto);

    this.setTokensToCookie(req, res, accessToken, refreshToken);

    return { accessToken, user };
  }

  @Public()
  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    this.setTokensToCookie(req, res, accessToken, refreshToken);

    return { accessToken, user };
  }

  @Get('me')
  me(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Public()
  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Cookie(REFRESH_COOKIE) token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.removeTokensFromCookie(req, res);

    try {
      await this.authService.logout(token);
    } catch {
      return { success: false };
    }

    return { success: true };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshTokens(
    @Cookie(REFRESH_COOKIE) token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.refreshTokens(token);

    this.setTokensToCookie(req, res, accessToken, refreshToken);

    return { accessToken, user };
  }

  setTokensToCookie(
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const cookieFactory = cookieLib(req, res);

    cookieFactory.set(ACCESS_COOKIE, accessToken, {
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    cookieFactory.set(REFRESH_COOKIE, refreshToken, {
      maxAge: 30 * 24 * 60 * 1000,
      path: '/auth',
    });
  }

  removeTokensFromCookie(req: Request, res: Response) {
    const cookieFactory = cookieLib(req, res);

    cookieFactory.remove(ACCESS_COOKIE);
    cookieFactory.remove(REFRESH_COOKIE);
  }
}
