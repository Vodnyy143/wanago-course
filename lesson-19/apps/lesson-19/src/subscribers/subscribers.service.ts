import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriberEntity } from './entities/subscriber.entity';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(SubscriberEntity)
    private readonly subscribersRepository: Repository<SubscriberEntity>,
  ) {}

  async addSubscriber(createSubscriberDto: CreateSubscriberDto) {
    const newSubscriber = this.subscribersRepository.create({
      email: createSubscriberDto.email,
      name: createSubscriberDto.name,
    });
    await this.subscribersRepository.save(newSubscriber);
    return newSubscriber;
  }

  async getAllSubscribers() {
    return this.subscribersRepository.find();
  }
}
