import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    {
      provide: 'SUBSCRIBERS_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://localhost:5672`],
            queue: process.env.RABBITMQ_QUEUE_NAME,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
