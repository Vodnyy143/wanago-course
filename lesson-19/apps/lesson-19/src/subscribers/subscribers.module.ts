import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriberEntity } from './entities/subscriber.entity';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberEntity])],
  providers: [SubscribersService],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
