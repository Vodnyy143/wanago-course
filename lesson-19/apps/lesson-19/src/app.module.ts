import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/lesson-19/.env',
    }),
    EnvModule,
    DatabaseModule,
    SubscribersModule,
  ],
})
export class AppModule {}
