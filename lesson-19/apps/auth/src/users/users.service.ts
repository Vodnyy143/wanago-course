import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
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

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  getAllUsers() {
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
