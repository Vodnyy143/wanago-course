import { Controller } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @MessagePattern({ cmd: 'add-subscriber' })
  addSubscriber(dto: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(dto);
  }

  @MessagePattern({ cmd: 'get-subscribers' })
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }
}
