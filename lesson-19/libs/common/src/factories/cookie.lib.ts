import { CookieOptions, Request, Response } from 'express';

export const cookieLib = (req: Request, res: Response) => {
  const set = (key: string, value: string, cookieOptions?: CookieOptions) => {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      ...cookieOptions,
    });
  };

  const get = (key: string) => {
    return req.cookies[key];
  };

  const remove = (key: string) => {
    res.clearCookie(key);
  };

  return {
    set,
    get,
    remove,
  };
};
