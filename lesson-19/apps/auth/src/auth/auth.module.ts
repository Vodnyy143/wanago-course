import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';
import { AccessStrategy } from './strategies/access.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './guards/access.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        ({
          secret: envService.get('ACCESS_SECRET'),
          signOptions: {
            expiresIn: envService.get('ACCESS_EXP'),
          },
        }) as JwtModuleOptions,
    }),
  ],
  providers: [
    AuthService,
    AccessStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
