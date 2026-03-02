import { Controller } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @MessagePattern({ cmd: 'add-subscriber' })
  async addSubscriber(
    @Payload() dto: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    const newSubscriber = await this.subscribersService.addSubscriber(dto);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);

    return newSubscriber;
  }

  @MessagePattern({ cmd: 'get-subscribers' })
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }
}
