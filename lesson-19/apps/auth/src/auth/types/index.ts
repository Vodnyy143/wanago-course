import type { Request } from 'express';

import { UserEntity } from '../../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

export interface AccessPayload {
  sub: string;
  email: string;
  firstName: string;
}

export interface RefreshPayload {
  userId: string;
}

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
