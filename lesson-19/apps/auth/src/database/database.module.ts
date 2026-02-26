import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from '../env/env.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: envService.get('POSTGRES_HOST'),
        port: +envService.get('POSTGRES_PORT'),
        username: envService.get('POSTGRES_USER'),
        password: envService.get('POSTGRES_PASSWORD'),
        database: envService.get('POSTGRES_DB'),
      }),
    }),
  ],
})
export class DatabaseModule {}
