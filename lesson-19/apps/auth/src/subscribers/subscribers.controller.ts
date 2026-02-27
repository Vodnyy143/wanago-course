import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('subscribers')
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE')
    private readonly subscribersService: ClientProxy,
  ) {}

  addSubscriber() {}
}
