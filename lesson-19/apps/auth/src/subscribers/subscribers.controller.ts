import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE')
    private readonly subscribersClient: ClientProxy,
  ) {}

  @Post()
  addSubscriber(@Body() dto: CreateSubscriberDto) {
    return this.subscribersClient.send({ cmd: 'add-subscriber' }, dto);
  }

  @Get()
  getSubscribers() {
    return this.subscribersClient.send({ cmd: 'get-subscribers' }, {});
  }
}
