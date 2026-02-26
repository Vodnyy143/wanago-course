import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('xls')
  async exportAllUsersToXLS(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TestExportXLS');

    worksheet.columns = [
      { header: 'id', key: 'id' },
      { header: 'firstName', key: 'firstName' },
      { header: 'lastName', key: 'lastName' },
      { header: 'email', key: 'email' },
    ];

    users.map((user) => {
      worksheet.addRow({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.header('Content-Disposition', 'attachment; filename=users.xlsx');
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
