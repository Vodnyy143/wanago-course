import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('xls')
  async exportAllUsersToXLS(@Res() res: Response) {
    const buffer = await this.usersService.generateUsersXls();

    res.header('Content-Disposition', 'attachment; filename=users.xlsx');
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
