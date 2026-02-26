import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import { AccessPayload, RefreshPayload } from './types';
import { EnvService } from '../env/env.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existsUser = await this.usersService.getUserByEmail(
      registerDto.email,
    );
    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    const newUser = await this.usersService.create({
      passwordHash,
      ...registerDto,
    });

    const { accessToken, refreshToken, user } = await this.getTokens(newUser);

    await this.usersService.setCurrentRefreshToken(newUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const existsUser = await this.usersService.getUserByEmail(loginDto.email);
    if (!existsUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matchingPasswords = await argon2.verify(
      existsUser.passwordHash,
      loginDto.password,
    );
    if (!matchingPasswords) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken, user } =
      await this.getTokens(existsUser);

    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.usersService.getUserByRefresh(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.usersService.setCurrentRefreshToken(user.id, null);
  }

  async refreshTokens(token: string) {
    const existsUser = await this.usersService.getUserByRefresh(token);
    if (!existsUser) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken, user } =
      await this.getTokens(existsUser);

    await this.usersService.setCurrentRefreshToken(existsUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async getTokens(user: UserEntity) {
    const accessPayload: AccessPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
    };
    const accessToken = this.jwtService.sign(accessPayload);

    const refreshPayload: RefreshPayload = {
      userId: user.id,
    };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: this.envService.get('REFRESH_EXP'),
      secret: this.envService.get('REFRESH_SECRET'),
    } as JwtSignOptions);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
