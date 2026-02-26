import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Repository } from 'typeorm';
import { Response } from 'express';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
    });

    return this.usersRepository.save(newUser);
  }

  async generateUsersXls() {
    const users = await this.getAllUsers();

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

    return buffer;
  }

  private getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }

    return user;
  }

  async getUserByRefresh(currentRefreshToken: string) {
    const user = await this.usersRepository.findOne({
      where: { currentRefreshToken },
    });
    if (!user) {
      return null;
    }

    return user;
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string | null) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.update(userId, {
      currentRefreshToken: refreshToken,
    });
  }
}
